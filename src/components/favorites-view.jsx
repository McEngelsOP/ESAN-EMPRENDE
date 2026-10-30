"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, LayoutGrid, Search, X } from "lucide-react";
import { categories, initialProducts, offerPrice } from "@/lib/data";
import { norm } from "@/lib/workspace";
import { ProductImage } from "./product-image";
import { Ratings } from "./community-parts";

const tones = { "Comida y bebidas": "peach", "Moda y accesorios": "rose", "Arte y papelería": "sand", "Hogar y bienestar": "sage", "Soluciones tech": "sky", Servicios: "stone" };
const plural = (number, one, many) => number === 1 ? one : many;

export function FavoritesView({ products, saved, reviews = /** @type {import("@/lib/workspace").Review[]} */ ([]), category, query = "", onQuery, onFilter, onOpen, onStore, onFavorite, onNavigate }) {
  const [localQuery, setLocalQuery] = useState("");
  const search = onQuery ? query : localQuery;
  const setSearch = onQuery || setLocalQuery;
  const pending = useRef(new Map());
  useEffect(() => () => pending.current.forEach(timer => clearTimeout(timer)), []);
  const positions = new Map(saved.map((id, index) => [id, index]));
  const mine = products.filter(product => positions.has(product.id)).sort((a, b) => positions.get(b.id) - positions.get(a.id));
  const present = categories.slice(1).filter(value => mine.some(product => product.category === value));
  const activeCategory = present.includes(category) ? category : "Todos";
  const term = norm(search).trim();
  const list = mine.filter(product => (activeCategory === "Todos" || product.category === activeCategory) && norm(`${product.name} ${product.store} ${product.category} ${product.description}`).includes(term));
  const storesCount = new Set(mine.map(product => product.store)).size;
  const gone = saved.filter(id => !products.some(product => product.id === id));
  const seenCategories = new Set();
  const suggestions = products.filter(product => {
    if (!product.available || positions.has(product.id) || seenCategories.has(product.category) || seenCategories.size >= 3) return false;
    seenCategories.add(product.category);
    return true;
  });

  function toggle(event, product, isSaved) {
    if (!isSaved) { onFavorite(product.id); return; }
    if (pending.current.has(product.id)) return;
    const element = event.currentTarget.closest(".fav-card");
    element?.classList.add("is-leaving");
    const timer = setTimeout(() => {
      pending.current.delete(product.id);
      if (onFavorite(product.id) === false) { element?.classList.remove("is-leaving"); return; }
      window.__favToast?.(product.name, () => onFavorite(product.id));
    }, 300);
    pending.current.set(product.id, timer);
  }

  function resetFilters() { setSearch(""); onFilter({ category: "Todos" }); }

  function card(product, isSaved) {
    const productReviews = reviews.filter(review => review.productId === product.id);
    const kind = product.kind || "Producto";
    const example = Boolean(product.sampleSet) || initialProducts.some(item => item.id === product.id);
    const price = kind === "Servicio" && product.price > 0 ? `Desde ${offerPrice(product)}` : offerPrice(product);
    return <article className="fav-card" data-tone={tones[product.category] || "sage"} key={product.id}>
      <div className="fav-media"><button type="button" className="fav-photo" onClick={() => onOpen(product.id)} aria-label={`Ver ${product.name}`}><ProductImage src={product.image} alt={product.name} /></button><span className="fav-kind">{kind}</span>{!product.available && <span className="fav-unavailable">{kind === "Producto" ? "Agotado" : "No disponible"}</span>}<button type="button" className={`fav-heart${isSaved ? " is-saved" : ""}`} aria-pressed={isSaved} aria-label={`${isSaved ? "Quitar de" : "Añadir a"} favoritos: ${product.name}`} onClick={event => toggle(event, product, isSaved)}><Heart size={20} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" /></button></div>
      <div className="fav-info"><button type="button" className="fav-store" onClick={() => onStore(product.store)}>{product.store}<ArrowUpRight size={13} aria-hidden="true" /></button><h3><button type="button" className="fav-name" onClick={() => onOpen(product.id)}>{product.name}</button></h3><div className="fav-meta"><strong>{price}</strong><span>{product.category}</span></div><div className="fav-card-bottom">{example && <span className="fav-example">Ejemplo ficticio</span>}{productReviews.length > 0 && <Ratings reviews={productReviews} />}</div></div>
    </article>;
  }

  return <section className="fav-view" aria-label="Tus favoritos">
    {mine.length > 0 ? <>
      <div className="fav-bar"><p className="fav-summary" aria-live="polite"><Heart size={19} aria-hidden="true" />{mine.length} {plural(mine.length, "propuesta guardada", "propuestas guardadas")} de {storesCount} {plural(storesCount, "emprendimiento", "emprendimientos")}</p><label className="fav-search"><Search size={18} aria-hidden="true" /><input aria-label="Buscar en mis favoritos" placeholder="Busca entre tus guardados" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Limpiar búsqueda de favoritos" onClick={() => setSearch("")}><X size={17} aria-hidden="true" /></button>}</label>
        {present.length > 1 && <div className="categories fav-filters" role="group" aria-label="Filtrar favoritos por categoría">{["Todos", ...present].map((value, index) => <button type="button" aria-pressed={activeCategory === value} className={activeCategory === value ? "selected" : ""} onClick={() => onFilter({ category: value })} key={value}>{index === 0 && <LayoutGrid size={15} aria-hidden="true" />}<span>{value}</span><span className="emp-filter-count">{value === "Todos" ? mine.length : mine.filter(product => product.category === value).length}</span></button>)}</div>}
      </div>
      {(term || activeCategory !== "Todos") && <p className="fav-results" aria-live="polite">{list.length} {plural(list.length, "resultado", "resultados")} en tus favoritos</p>}
      {list.length > 0 ? <div className="fav-grid">{list.map(product => card(product, true))}</div> : <div className="fav-no-results"><Search size={27} aria-hidden="true" /><h2>No hay favoritos con esos filtros.</h2><p>Tus guardados siguen aquí. Prueba otra búsqueda o vuelve a verlos todos.</p><button type="button" className="fav-reset" onClick={resetFilters}>Ver todos mis favoritos<X size={15} aria-hidden="true" /></button></div>}
    </> : <>
      <div className="fav-empty"><Heart size={44} strokeWidth={1.25} aria-hidden="true" /><h2>Haz espacio para tus favoritos.</h2><p>Toca el corazón de una propuesta para guardarla. Así podrás volver a verla cuando quieras.</p><button type="button" className="fav-btn" onClick={() => onNavigate("catalog")}>Explorar propuestas<ArrowUpRight size={17} aria-hidden="true" /></button></div>
      {suggestions.length > 0 && <div className="fav-suggest"><h2>Para empezar, mira estas.</h2><div className="fav-grid">{suggestions.map(product => card(product, false))}</div></div>}
    </>}
    {gone.length > 0 && <div className="fav-gone"><span>{gone.length} {plural(gone.length, "publicación guardada ya no está disponible en este catálogo", "publicaciones guardadas ya no están disponibles en este catálogo")}.</span>{gone.map(id => <button type="button" className="fav-reset" key={id} onClick={() => onFavorite(id)}>Quitar referencia no disponible<X size={15} aria-hidden="true" /></button>)}</div>}
    {mine.length > 0 && <div className="fav-more"><p>Siempre hay algo más por descubrir.</p><button type="button" className="fav-btn" onClick={() => onNavigate("catalog")}>Explorar propuestas<ArrowUpRight size={17} aria-hidden="true" /></button></div>}
  </section>;
}
