"use client";

import React from "react";
import { Fragment } from "react";
import { categories } from "@/lib/data";
import { storeAcademic } from "@/lib/data";
import { storeDescriptions } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { offerPrice } from "@/lib/data";
import { Search } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { ProductImage } from "./product-image";
export function BusinessDirectory({
  listedStores: listedStores,
  stores: stores,
  business: business,
  query,
  category,
  onFilter: onFilter,
  onStore: onStore,
  onNavigate: onNavigate
}) {
  const f = {
    q: query,
    category
  };
  return (() => {
    let tones = {
        "Comida y bebidas": "peach",
        "Moda y accesorios": "rose",
        "Arte y papelería": "sand",
        "Hogar y bienestar": "sage",
        "Soluciones tech": "sky",
        Servicios: "stone"
      },
      total = listedStores.reduce((n, st) => n + st.items.length, 0),
      plural = (n, one, many) => n === 1 ? one : many,
      countFor = ca => ca === "Todos" ? stores.length : stores.filter(st => st.items.some(it => it.category === ca) || business?.name === st.name && business.category === ca).length;
    return <Fragment><div className="emp-toolbar"><label className="search"><Search size={18} /><input aria-label="Buscar emprendimientos" placeholder="Busca por nombre o creador" value={f.q} onChange={h => onFilter({
            q: h.target.value
          }, !0)} /></label><div className="categories emp-filters" role="group" aria-label="Filtrar por categoría">{categories.map((ca, ix) => <button type="button" aria-pressed={f.category === ca} className={f.category === ca ? "selected" : ""} onClick={() => onFilter({
            category: ca
          })} key={ca}>{ix === 0 && <LayoutGrid size={14} />}{ca}<span className="emp-filter-count">{countFor(ca)}</span></button>)}</div></div><p className="results emp-count" aria-live="polite" key={listedStores.length + f.category + f.q}>{listedStores.length ? `${listedStores.length} ${plural(listedStores.length, "emprendimiento", "emprendimientos")} con ${total} ${plural(total, "propuesta", "propuestas")} para descubrir` + (f.category !== "Todos" ? ` en ${f.category}` : "") : "Sin resultados por ahora"}</p><div className="emp-list">{listedStores.map(({
          name: name,
          items: items,
          id: id
        }, ix) => {
          let own = business?.name === name,
            who = items[0]?.owner || (own ? business.owner : "") || "",
            acad = storeAcademic[name],
            cats = Array.from(new Set(items.map(g => g.category)));
          own && !cats.length && business.category && cats.push(business.category);
          let shown = items.slice(0, 4);
          return <article className="emp-row" data-tone={tones[cats[0]] || "sage"} style={{
            "--i": Math.min(ix, 6)
          }} key={id + "-" + f.category}><div className="emp-media"><span className="emp-blob b1" aria-hidden="true" /><span className="emp-blob b2" aria-hidden="true" /><span className="emp-monogram" aria-hidden="true">{name[0]}</span><ProductImage src={own && business.cover ? business.cover : items[0]?.image || "idea"} alt={`Propuestas de ${name}`} sizes="(max-width:760px) 90vw, 300px" /><span className="emp-heart emp-spark s1" aria-hidden="true" /><span className="emp-heart emp-spark s2" aria-hidden="true" /></div><div className="emp-main"><h2><button type="button" className="emp-open" onClick={() => onStore(name)}>{name}</button></h2>{(who || acad) && <p className="emp-creator">{who && <strong>{who}</strong>}{acad && <span>{`${acad[0]}, ${acad[1]}.º ciclo`}</span>}</p>}<p className="emp-desc">{own && business.description || storeDescriptions[name] || "Una propuesta de nuestra comunidad."}</p>{!!cats.length && <div className="emp-tags">{cats.map(g => <span key={g}>{g}</span>)}</div>}<span className="emp-cta" aria-hidden="true">{who ? `Conocer a ${who}` : "Conocer emprendimiento"}<ArrowUpRight size={17} /></span></div><ul className="emp-offers" aria-label={`Propuestas de ${name}`}>{shown.length ? shown.map(g => <li key={g.id}><span>{g.name}</span><span>{offerPrice(g)}</span></li>) : <li className="emp-offers-empty">{"Aún no publica propuestas."}</li>}{items.length > shown.length && <li className="emp-offers-more">{`y ${items.length - shown.length} más`}</li>}</ul></article>;
        })}</div>{!listedStores.length && <div className="empty"><h2>{"Todavía no encontramos ese emprendimiento."}</h2><p>{"Prueba con otro nombre o cambia la categoría. Seguro hay algo para ti."}</p><button className="text-button" onClick={() => onFilter({
          q: "",
          category: "Todos"
        })}>{"Limpiar filtros"}</button></div>}<section className="emp-invite"><span className="emp-heart emp-float f1" aria-hidden="true" /><span className="emp-heart emp-float f2" aria-hidden="true" /><span className="emp-heart emp-float f3" aria-hidden="true" /><div><h2>{"¿Tienes algo que contar?"}</h2><p>{"Publica tu emprendimiento y deja que la comunidad ESAN lo conozca, lo comparta y lo apoye."}</p></div><button type="button" className="emp-invite-btn" onClick={() => onNavigate("dashboard")}>{"Publicar mi emprendimiento"}<ArrowUpRight size={17} /></button></section></Fragment>;
  })();
}
