import Image from 'next/image';
import { Code2, Lightbulb } from 'lucide-react';
const images = ['/images/cookies.jpg', '/images/bag.jpg', '/images/plant.jpg', '/images/jewelry.jpg', '/images/coffee.jpg', '/images/notebook.jpg'];
export function ProductImage({ src, alt, sizes="(max-width: 760px) 45vw, (max-width: 1280px) 30vw, 420px", preload=false }: { src: string; alt: string; sizes?: string; preload?: boolean }) {
  if (src === 'tech' || src === 'idea') {
    const Icon = src === 'tech' ? Code2 : Lightbulb;
    return <div className={`offer-art ${src}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined}><Icon size={56} strokeWidth={1.25}/><span aria-hidden="true">{src === 'tech' ? 'Ideas que funcionan.' : 'Todo empieza con una idea.'}</span></div>;
  }
  if (/^data:image\/(png|jpeg|webp);base64,/i.test(src)) return <div className="image-frame"><img src={src} alt={alt} loading={preload?'eager':'lazy'} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/></div>;
  const index = Math.max(0, images.indexOf(src));
  const name=images[index].split('/').pop()!.replace('.jpg','.webp');
  return <div className="image-frame"><Image src={`/images/demo-v1/${name}`} alt={alt} fill sizes={sizes} preload={preload} style={{objectFit:'cover'}}/></div>;
}
