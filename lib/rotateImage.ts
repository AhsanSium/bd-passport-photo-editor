/**
 * Rotates a dataUrl image by `degrees` (90 | -90 | 180) using Canvas API.
 * Returns a new dataUrl with the same mime type as the input.
 * For 90° rotations the output width and height are swapped.
 */
export function rotateImage(dataUrl: string, degrees: 90 | -90 | 180): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img
      const canvas = document.createElement('canvas')

      // 90° rotations flip the dimensions
      const [cw, ch] = Math.abs(degrees) === 90 ? [h, w] : [w, h]
      canvas.width = cw
      canvas.height = ch

      const ctx = canvas.getContext('2d')!
      ctx.translate(cw / 2, ch / 2)
      ctx.rotate((degrees * Math.PI) / 180)
      ctx.drawImage(img, -w / 2, -h / 2)

      // Preserve the original mime type; use high quality for JPEG
      const mime = dataUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
      resolve(canvas.toDataURL(mime, mime === 'image/jpeg' ? 0.97 : undefined))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}
