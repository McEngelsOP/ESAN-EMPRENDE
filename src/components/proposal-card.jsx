"use client";

import React from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import { initialProducts, offerPrice } from "@/lib/data";
import { ProductImage } from "./product-image";
import { Ratings } from "./community-parts";

export function ProposalCard({ product, saved, reviews = /** @type {import("@/lib/workspace").Review[]} */ ([]), onOpen, onStore, onFavorite }) {
  const kind = product.kind || "Producto";
  const example = Boolean(product.sampleSet) || initialProducts.some(item => item.id === product.id);
  const price = kind === "Servicio" && product.price > 0 ? `Desde ${offerPrice(product)}` : offerPrice(product);
  const availability = product.available ? kind === "Idea" ? "Abierta a colaborar" : "Disponible" : kind === "Producto" ? "Agotado" : "No disponible";

  return <article className="product-card" data-category={product.category} data-available={product.available}>
    <div className="product-photo">
      <button type="button" onClick={onOpen} className="product-image-button" aria-label={`Ver ${product.name}`}><ProductImage src={product.image} alt={product.name} /></button>
      <div className="product-labels"><span className="kind-tag">{kind}</span>{example && <span className="product-example">Ejemplo</span>}</div>
      <button type="button" className={`favorite${saved ? " is-saved" : ""}`} onClick={onFavorite} aria-label={`${saved ? "Quitar de" : "Añadir a"} favoritos: ${product.name}`} aria-pressed={saved}><Heart size={19} fill={saved ? "currentColor" : "none"} aria-hidden="true" /></button>
      {!product.available && <span className="unavailable">{availability}</span>}
    </div>
    <div className="product-info">
      <button type="button" className="store-name" onClick={onStore}>{product.store}<ArrowUpRight size={13} aria-hidden="true" /></button>
      <h3><button type="button" className="product-name" onClick={onOpen}>{product.name}</button></h3>
      <div className="product-price-line"><strong>{price}</strong></div><p className="product-category">{product.category}</p>
      <div className="product-card-footer"><span className="product-state" data-available={product.available}><i aria-hidden="true" />{availability}</span>{reviews.length > 0 && <Ratings reviews={reviews} />}</div>
    </div>
  </article>;
}
