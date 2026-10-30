"use client";

import React from "react";
import { ArrowUpRight, LayoutGrid, Search, X } from "lucide-react";
import { categories, initialProducts, offerPrice, storeAcademic, storeDescriptions } from "@/lib/data";
import { ProductImage } from "./product-image";
import { sampleStoreInfo } from "@/lib/demo-content";

const tones = { "Comida y bebidas": "peach", "Moda y accesorios": "rose", "Arte y papelería": "sand", "Hogar y bienestar": "sage", "Soluciones tech": "sky", Servicios: "stone" };
const plural = (number, one, many) => number === 1 ? one : many;

export function BusinessDirectory({ listedStores, stores, business, query = "", category, onFilter, onStore, onNavigate }) {
  const total = listedStores.reduce((count, store) => count + store.items.length, 0);
  const countFor = value => value === "Todos" ? stores.length : stores.filter(store => store.items.some(item => item.category === value) || business?.name === store.name && business.category === value).length;
  const filtered = query || category !== "Todos";
  return <>
    <div className="emp-toolbar">
      <label className="search"><Search size={18} aria-hidden="true" /><input aria-label="Buscar emprendimientos" placeholder="Busca por nombre o creador" value={query} onChange={event => onFilter({ q: event.target.value }, true)} />{query && <button type="button" className="emp-search-clear" aria-label="Limpiar búsqueda de emprendimientos" onClick={() => onFilter({ q: "" }, true)}><X size={17} aria-hidden="true" /></button>}</label>
      <div className="categories emp-filters" role="group" aria-label="Filtrar por categoría">{categories.map((value, index) => <button type="button" aria-pressed={category === value} className={category === value ? "selected" : ""} onClick={() => onFilter({ category: value })} key={value}>{index === 0 && <LayoutGrid size={15} aria-hidden="true" />}<span>{value}</span><span className="emp-filter-count">{countFor(value)}</span></button>)}</div>
    </div>
    <div className="emp-results-bar"><p className="results emp-count" aria-live="polite">{listedStores.length ? <><strong>{listedStores.length} {plural(listedStores.length, "emprendimiento", "emprendimientos")}</strong><span>{total} {plural(total, "propuesta", "propuestas")} para descubrir{category !== "Todos" ? ` en ${category}` : ""}</span></> : "Sin resultados por ahora"}</p>{filtered && <button type="button" className="emp-reset" onClick={() => onFilter({ q: "", category: "Todos" })}>Limpiar filtros<X size={15} aria-hidden="true" /></button>}</div>
    <div className="emp-list">{listedStores.map(({ name, items, id }) => {
      const own = business?.name === name;
      const who = items[0]?.owner || (own ? business.owner : "") || "";
      const sample = sampleStoreInfo[name];
      const academic = own ? null : sample ? [sample.career, sample.cycle] : storeAcademic[name];
      const storeCategories = Array.from(new Set(items.map(item => item.category)));
      if (own && !storeCategories.length && business.category) storeCategories.push(business.category);
      const example = Boolean(own && business.sampleSet) || items.some(item => item.sampleSet) || initialProducts.some(item => item.store === name);
      const shown = items.slice(0, 4);
      const available = items.filter(item => item.available).length;
      return <article className="emp-row" data-tone={tones[storeCategories[0]] || "sage"} key={id}>
        <button type="button" className="emp-media emp-media-open" onClick={() => onStore(name)} aria-label={`Ver el emprendimiento ${name}`}><ProductImage src={own && business.cover ? business.cover : sample?.cover || items[0]?.image || "idea"} alt={`Propuestas de ${name}`} sizes="(max-width:760px) 90vw, 300px" />{example && <span className="emp-example">Ejemplo ficticio</span>}</button>
        <div className="emp-main"><h2><button type="button" className="emp-open" onClick={() => onStore(name)}>{name}</button></h2>{(who || academic) && <p className="emp-creator">{who && <strong>Por {who}</strong>}{academic && <span>{academic[0]} · {academic[1]}.º ciclo</span>}</p>}<p className="emp-desc">{own && business.description || sample?.description || storeDescriptions[name] || "Una propuesta de nuestra comunidad."}</p>{storeCategories.length > 0 && <div className="emp-tags">{storeCategories.map(value => <span key={value}>{value}</span>)}</div>}<button type="button" className="emp-cta" onClick={() => onStore(name)} aria-label={`Conocer ${name}`}>Conocer emprendimiento<ArrowUpRight size={17} aria-hidden="true" /></button></div>
        <div className="emp-offer-summary"><p className="emp-offer-heading">{items.length} {plural(items.length, "propuesta", "propuestas")}<span>{available} {plural(available, "disponible", "disponibles")}</span></p><ul className="emp-offers" aria-label={`Propuestas de ${name}`}>{shown.length ? shown.map(item => <li key={item.id}><span>{item.name}{!item.available && <small>No disponible</small>}</span><span>{offerPrice(item)}</span></li>) : <li className="emp-offers-empty">Aún no publica propuestas.</li>}{items.length > shown.length && <li className="emp-offers-more">y {items.length - shown.length} más en su perfil</li>}</ul></div>
      </article>;
    })}</div>
    {!listedStores.length && <div className="emp-empty"><Search size={28} aria-hidden="true" /><h2>{filtered ? "No encontramos ese emprendimiento." : "Aquí empieza la comunidad."}</h2><p>{filtered ? "Prueba con otro nombre o cambia la categoría." : "Los emprendimientos aparecerán aquí cuando haya propuestas para explorar."}</p>{filtered && <button type="button" className="emp-reset" onClick={() => onFilter({ q: "", category: "Todos" })}>Limpiar filtros<X size={15} aria-hidden="true" /></button>}</div>}
    <section className="emp-invite"><div><h2>Tu emprendimiento también tiene un lugar.</h2><p>Presenta lo que creas y prepara tus primeras propuestas para la comunidad ESAN.</p></div><button type="button" className="emp-invite-btn" onClick={() => onNavigate("dashboard")}>Crear mi emprendimiento<ArrowUpRight size={17} aria-hidden="true" /></button></section>
  </>;
}
