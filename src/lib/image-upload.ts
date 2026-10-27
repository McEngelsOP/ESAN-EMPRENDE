export async function readUploadedImage(file: File):Promise<string> {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw Error('Elige una imagen JPG, PNG o WebP de hasta 5 MB.');
 const bitmap=await createImageBitmap(file);
 try{const factor=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*factor);canvas.height=Math.round(bitmap.height*factor);const context=canvas.getContext('2d');if(!context)throw Error('No se pudo procesar la imagen.');context.drawImage(bitmap,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',.82)}finally{bitmap.close()}
}
