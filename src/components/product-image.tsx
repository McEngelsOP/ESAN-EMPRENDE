import { Code2, Lightbulb } from 'lucide-react';
const images = ['/images/cookies.jpg', '/images/bag.jpg', '/images/plant.jpg', '/images/jewelry.jpg', '/images/coffee.jpg', '/images/notebook.jpg'];
export function ProductImage({ src, alt }: { src: string; alt: string }) {
  if (src === 'tech' || src === 'idea') {
    const Icon = src === 'tech' ? Code2 : Lightbulb;
    return <div className={`offer-art ${src}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined}><Icon size={56} strokeWidth={1.25}/><span aria-hidden="true">{src === 'tech' ? 'Ideas que funcionan.' : 'Todo empieza con una idea.'}</span></div>;
  }
  const index = Math.max(0, images.indexOf(src));
  return <div className="image-frame"><img src="/images/products-sheet.png" alt={alt} style={{left:`-${index % 3 * 100}%`,top:`-${Math.floor(index / 3) * 100}%`}}/></div>;
}
