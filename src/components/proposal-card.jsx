"use client";

import React from "react";
import { HvProductMedia } from "./home-showcase";
import { ArrowUpRight } from "lucide-react";
import { offerPrice } from "@/lib/data";
import { ProductImage } from "./product-image";
import { Heart } from "lucide-react";
import { Ratings } from "./community-parts";
export function ProposalCard({
  product: product,
  saved: saved,
  reviews: reviews,
  onOpen: onOpen,
  onStore: onStore,
  onFavorite: onFavorite
}) {
  return <article className="product-card" data-category={product.category}><div className="product-photo"><button onClick={onOpen} className="product-image-button" aria-label={`Ver ${product.name}`}>{/^data:image\//.test(product.image || "") ? <ProductImage src={product.image} alt={product.name} /> : <HvProductMedia product={product} />}</button><span className="kind-tag">{product.kind || "Producto"}</span><button className={"favorite " + (saved ? "is-saved" : "")} onClick={onFavorite} aria-label={`${saved ? "Quitar de" : "Añadir a"} favoritos: ${product.name}`} aria-pressed={saved}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>{!product.available && <span className="unavailable">{"No disponible"}</span>}</div><div className="product-info"><button className="store-name" onClick={onStore}>{product.store}<ArrowUpRight size={12} /></button><h3><button className="product-name" onClick={onOpen}>{product.name}</button></h3><div><strong>{offerPrice(product)}</strong><span>{product.category}</span></div><Ratings reviews={reviews} /></div></article>;
}
