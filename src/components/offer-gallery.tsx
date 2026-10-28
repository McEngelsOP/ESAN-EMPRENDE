'use client';
import { useState } from 'react';
import type { Product } from '@/lib/data';
import { ProductImage } from './product-image';

export function OfferGallery({ product }: { product: Product }) {
 const photos = Array.isArray(product.images) && product.images.length ? product.images.slice(0,3) : [product.image];
 const [active,setActive] = useState(0);
 return <div className="offer-gallery"><div className="detail-image"><ProductImage src={photos[active] || photos[0] || ''} alt={`${product.name}, foto ${active+1}`} sizes="(max-width:760px) 90vw, 480px"/></div>{photos.length>1&&<div className="offer-gallery-controls" aria-label="Fotos de la publicación">{photos.map((photo,index)=><button type="button" key={index} aria-label={`Ver foto ${index+1}`} aria-pressed={active===index} onClick={()=>setActive(index)}><ProductImage src={photo} alt=""/></button>)}</div>}</div>;
}
