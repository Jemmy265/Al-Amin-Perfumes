/* Prepares a phone photo for upload: fixes rotation, scales to max 1600px and
   re-encodes (WebP where the browser can, otherwise JPEG). A 6–12 MB camera
   photo becomes ~200–400 KB, so uploads succeed even on slow mobile data. */
const MAX_SIDE = 1600;

export async function prepareImage(file: File): Promise<Blob> {
  if (file.type && !file.type.startsWith("image/")) throw new Error("الملف ده مش صورة — اختر صورة من الجاليري أو صوّر بالكاميرا.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("مش قادرين نقرأ الصورة دي. جرّب صورة تانية (JPG أو PNG).");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs get a clean white background
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const encode = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q));
  let blob = await encode("image/webp", 0.85);
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", 0.86); // Safari can't encode WebP
  if (!blob) throw new Error("حصلت مشكلة في تجهيز الصورة. جرّب تاني.");
  return blob;
}
