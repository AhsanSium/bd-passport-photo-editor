import type { PercentCrop } from 'react-image-crop'
import type { SignaturePreset } from './signaturePresets'

export type SigFormat = 'jpeg' | 'png'

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * Detects the paper boundaries inside a binarised region by scanning inward
 * from each edge.
 *
 * Background artefacts (notebook bindings, dark tables, coloured covers) form
 * dense strips: every column/row inside them has a very high fraction of dark
 * pixels.  Paper interior and signature strokes are sparse.
 *
 * We scan from each edge inward (up to `maxFraction` of the dimension), waiting
 * for the dense zone to end, then record the boundary at the first sparse column
 * / row we encounter.  If no dense zone is found the boundary stays at the edge
 * (no trimming applied).
 */
function findPaperBounds(
  binary: Uint8Array,
  rw: number,
  rh: number,
): { left: number; top: number; right: number; bottom: number } {
  const DENSITY  = 0.40   // columns/rows above this fraction are treated as background
  const MAX_SCAN = 0.40   // only search the outer 40 % of each dimension

  const scanX = Math.floor(rw * MAX_SCAN)
  const scanY = Math.floor(rh * MAX_SCAN)

  let left = 0, right = rw - 1, top = 0, bottom = rh - 1

  // Right edge → scan leftward
  let inDense = false
  for (let x = rw - 1; x >= rw - scanX; x--) {
    let dark = 0
    for (let y = 0; y < rh; y++) if (binary[y * rw + x]) dark++
    const d = dark / rh
    if (d >= DENSITY) { inDense = true }
    else if (inDense) { right = x; break }
  }

  // Left edge → scan rightward
  inDense = false
  for (let x = 0; x < scanX; x++) {
    let dark = 0
    for (let y = 0; y < rh; y++) if (binary[y * rw + x]) dark++
    const d = dark / rh
    if (d >= DENSITY) { inDense = true }
    else if (inDense) { left = x; break }
  }

  // Bottom edge → scan upward
  inDense = false
  for (let y = rh - 1; y >= rh - scanY; y--) {
    let dark = 0
    for (let x = 0; x < rw; x++) if (binary[y * rw + x]) dark++
    const d = dark / rw
    if (d >= DENSITY) { inDense = true }
    else if (inDense) { bottom = y; break }
  }

  // Top edge → scan downward
  inDense = false
  for (let y = 0; y < scanY; y++) {
    let dark = 0
    for (let x = 0; x < rw; x++) if (binary[y * rw + x]) dark++
    const d = dark / rw
    if (d >= DENSITY) { inDense = true }
    else if (inDense) { top = y; break }
  }

  return { left, top, right, bottom }
}

/**
 * Processes a handwritten signature photo:
 * 1. Restricts the analysis region to `cropPct` (if provided).
 * 2. Binarises with `threshold`.
 * 3. Detects paper boundaries using column/row density scanning — this
 *    reliably excludes notebook bindings, dark tables, and coloured covers
 *    regardless of how wide they are.
 * 4. Finds the ink bounding box only within the paper region.
 * 5. Letterboxes the cleaned crop into the preset dimensions.
 */
export async function processSignaturePhoto(
  sourceDataUrl: string,
  cropPct: PercentCrop | null,
  preset: SignaturePreset,
  threshold: number,
  format: SigFormat,
  quality: number,
): Promise<{ dataUrl: string; sizeBytes: number }> {
  const img = await loadImage(sourceDataUrl)
  const nw = img.naturalWidth
  const nh = img.naturalHeight

  // --- 1. Determine analysis region ---
  const rx = cropPct ? Math.round((cropPct.x      / 100) * nw) : 0
  const ry = cropPct ? Math.round((cropPct.y      / 100) * nh) : 0
  const rw = cropPct ? Math.round((cropPct.width  / 100) * nw) : nw
  const rh = cropPct ? Math.round((cropPct.height / 100) * nh) : nh

  // --- 2. Draw region → pixels ---
  const workCanvas = document.createElement('canvas')
  workCanvas.width  = rw
  workCanvas.height = rh
  const workCtx = workCanvas.getContext('2d')!
  workCtx.drawImage(img, rx, ry, rw, rh, 0, 0, rw, rh)
  const { data } = workCtx.getImageData(0, 0, rw, rh)

  // --- 3. Binarise ---
  const binary = new Uint8Array(rw * rh)
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      const i = (y * rw + x) * 4
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (lum < threshold) binary[y * rw + x] = 1
    }
  }

  // --- 4. Detect paper boundaries ---
  const paper = findPaperBounds(binary, rw, rh)

  // --- 5. Ink bounding box within paper bounds ---
  let minX = rw, minY = rh, maxX = -1, maxY = -1
  for (let y = paper.top; y <= paper.bottom; y++) {
    for (let x = paper.left; x <= paper.right; x++) {
      if (binary[y * rw + x] === 1) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  // Fallback: search whole region if no ink inside paper bounds
  if (maxX === -1) {
    for (let y = 0; y < rh; y++) {
      for (let x = 0; x < rw; x++) {
        if (binary[y * rw + x] === 1) {
          if (x < minX) minX = x
          if (y < minY) minY = y
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
        }
      }
    }
  }

  // Final fallback: use full region
  if (maxX === -1) { minX = 0; minY = 0; maxX = rw - 1; maxY = rh - 1 }

  // --- 6. Pad the ink bounding box ---
  const padX = Math.max(12, Math.round((maxX - minX) * 0.08))
  const padY = Math.max(12, Math.round((maxY - minY) * 0.12))
  // Clamp to paper bounds (not full region) to keep background out
  minX = Math.max(paper.left,   minX - padX)
  minY = Math.max(paper.top,    minY - padY)
  maxX = Math.min(paper.right,  maxX + padX)
  maxY = Math.min(paper.bottom, maxY + padY)

  const cropW = maxX - minX + 1
  const cropH = maxY - minY + 1

  // --- 7. Render binarised crop ---
  const binCanvas = document.createElement('canvas')
  binCanvas.width  = cropW
  binCanvas.height = cropH
  const binCtx = binCanvas.getContext('2d')!
  const binImg = binCtx.createImageData(cropW, cropH)

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const isInk = binary[(minY + y) * rw + (minX + x)] === 1
      const di = (y * cropW + x) * 4
      const val = isInk ? 0 : 255
      binImg.data[di]     = val
      binImg.data[di + 1] = val
      binImg.data[di + 2] = val
      binImg.data[di + 3] = 255
    }
  }
  binCtx.putImageData(binImg, 0, 0)

  // --- 8. Letterbox into output canvas ---
  const { widthPx: outW, heightPx: outH } = preset
  let outCanvas: HTMLCanvasElement | OffscreenCanvas
  let outCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

  if (typeof OffscreenCanvas !== 'undefined') {
    outCanvas = new OffscreenCanvas(outW, outH)
    outCtx = outCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  } else {
    outCanvas = document.createElement('canvas')
    outCanvas.width  = outW
    outCanvas.height = outH
    outCtx = (outCanvas as HTMLCanvasElement).getContext('2d')!
  }

  outCtx.fillStyle = '#FFFFFF'
  outCtx.fillRect(0, 0, outW, outH)

  const scale = Math.min(outW / cropW, outH / cropH)
  const dstW  = Math.round(cropW * scale)
  const dstH  = Math.round(cropH * scale)
  const dstX  = Math.round((outW - dstW) / 2)
  const dstY  = Math.round((outH - dstH) / 2)
  outCtx.drawImage(binCanvas, 0, 0, cropW, cropH, dstX, dstY, dstW, dstH)

  // --- 9. Export ---
  let dataUrl: string
  if (outCanvas instanceof OffscreenCanvas) {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const blob = await outCanvas.convertToBlob({ type: mimeType, quality })
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } else {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    dataUrl = (outCanvas as HTMLCanvasElement).toDataURL(mimeType, quality)
  }

  const base64 = dataUrl.split(',')[1] ?? ''
  return { dataUrl, sizeBytes: Math.round(base64.length * 0.75) }
}
