// Derivados de publicación: separación de la lámina de demostración y compresión.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const source=new URL('../assets/source/products-sheet.png',import.meta.url);
const destination=new URL('../public/images/demo-v1/',import.meta.url);
await mkdir(destination,{recursive:true});
const names=['cookies','bag','plant','jewelry','coffee','notebook'];
const metadata=await sharp(source.pathname).metadata();
if(!metadata.width||!metadata.height||metadata.width%3||metadata.height%2)throw new Error('Dimensiones inesperadas en la lámina original');
const width=metadata.width/3,height=metadata.height/2;
for(const [i,name] of names.entries()){
 const info=await sharp(source.pathname).extract({left:i%3*width,top:Math.floor(i/3)*height,width,height}).webp({quality:80,effort:5}).toFile(new URL(name+'.webp',destination).pathname);
 console.log(name,info.size+' bytes');
}
