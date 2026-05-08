import type { PhotoPreset } from './presets'
import type { PixelCrop } from 'react-image-crop'

export type OutputFormat = 'jpeg' | 'png' | 'webp'

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

function centerCrop(
  imgWidth: number,
  imgHeight: number,
  dstWidth: number,
  dstHeight: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const srcRatio = imgWidth / imgHeight
  const dstRatio = dstWidth / dstHeight

  let sw: number, sh: number, sx: number, sy: number

  if (srcRatio > dstRatio) {
    sh = imgHeight
    sw = Math.round(imgHeight * dstRatio)
    sx = Math.round((imgWidth - sw) / 2)
    sy = 0
  } else {
    sw = imgWidth
    sh = Math.round(imgWidth / dstRatio)
    sx = 0
    sy = Math.round((imgHeight - sh) / 2)
  }

  return { sx, sy, sw, sh }
}

export async function processPassportPhoto(
  sourceDataUrl: string,
  completedCrop: PixelCrop | null,
  preset: PhotoPreset,
  quality: number,
  bgColor: string,
  format: OutputFormat,
): Promise<{ dataUrl: string; sizeBytes: number }> {
  const img = await loadImage(sourceDataUrl)
  const { widthPx: outW, heightPx: outH } = preset

  let canvas: HTMLCanvasElement | OffscreenCanvas
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(outW, outH)
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  } else {
    canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    ctx = (canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
  }

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, outW, outH)

  const { sx, sy, sw, sh } = completedCrop
    ? {
        sx: completedCrop.x,
        sy: completedCrop.y,
        sw: completedCrop.width,
        sh: completedCrop.height,
      }
    : centerCrop(img.naturalWidth, img.naturalHeight, outW, outH)

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)

  let dataUrl: string

  if (canvas instanceof OffscreenCanvas) {
    const mimeType = `image/${format}` as const
    const blob = await canvas.convertToBlob({ type: mimeType, quality })
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } else {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
    dataUrl = (canvas as HTMLCanvasElement).toDataURL(mimeType, quality)
  }

  const base64 = dataUrl.split(',')[1] ?? ''
  const sizeBytes = Math.round(base64.length * 0.75)

  return { dataUrl, sizeBytes }
}
