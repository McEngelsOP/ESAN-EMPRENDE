"use client";

import React from "react";
import { Coffee } from "lucide-react";
import { Shirt } from "lucide-react";
import { Palette } from "lucide-react";
import { House } from "lucide-react";
import { CodeXml } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { categories } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { offerPrice } from "@/lib/data";
import { Fragment } from "react";
import { ProductImage } from "./product-image";
import { Heart } from "lucide-react";
import { Ratings } from "./community-parts";
import { LayoutGrid } from "lucide-react";
export function FavoritesView({
  products: products,
  saved: saved,
  reviews,
  category,
  onFilter: onFilter,
  onOpen: onOpen,
  onStore: onStore,
  onFavorite: onFavorite,
  onNavigate: onNavigate
}) {
  const f = {
    category
  };
  const u = {
    reviews
  };
  const kh = [Coffee, Shirt, Palette, House, CodeXml, Lightbulb];
  return (() => {
    let tones = {
        "Comida y bebidas": "peach",
        "Moda y accesorios": "rose",
        "Arte y papelería": "sand",
        "Hogar y bienestar": "sage",
        "Soluciones tech": "sky",
        Servicios: "stone"
      },
      cats = categories.slice(1),
      mine = products.filter(p => saved.includes(p.id)).sort((p, q) => saved.indexOf(q.id) - saved.indexOf(p.id)),
      present = cats.filter(c => mine.some(p => p.category === c)),
      cat = present.includes(f.category) ? f.category : "Todos",
      list = cat === "Todos" ? mine : mine.filter(p => p.category === cat),
      nStores = new Set(mine.map(p => p.store)).size,
      gone = saved.filter(id => !products.some(p => p.id === id)),
      plural = (n, one, many) => n === 1 ? one : many,
      tilts = ["-1.3deg", ".9deg", "-.6deg", "1.2deg"],
      suggestions = (() => {
        let seen = new Set(),
          res = [];
        for (let p of products) if (p.available && !saved.includes(p.id) && !seen.has(p.category) && (seen.add(p.category), res.push(p), res.length === 3)) break;
        return res;
      })(),
      toggle = (ev, p, on) => {
        if (!on) {
          onFavorite(p.id);
          return;
        }
        let el = ev.currentTarget.closest(".fav-card");
        el && el.classList.add("is-leaving"), setTimeout(() => {
          onFavorite(p.id), window.__favToast && window.__favToast(p.name, () => onFavorite(p.id));
        }, 300);
      },
      card = (p, ix, on) => {
        let rev = u.reviews.filter(g => g.productId === p.id),
          Icon = kh[cats.indexOf(p.category)] || Lightbulb;
        return <article className="fav-card" data-tone={tones[p.category] || "sage"} style={{
          "--i": Math.min(ix, 7),
          "--tilt": tilts[ix % 4]
        }} key={p.id}><div className="fav-media"><span className="emp-blob b1" aria-hidden="true" /><span className="emp-blob b2" aria-hidden="true" /><Icon className="fav-icon" size={84} strokeWidth={.9} aria-hidden="true" /><button type="button" className="fav-photo" onClick={() => onOpen(p.id)} aria-label={`Ver ${p.name}`}><ProductImage src={p.image} alt={p.name} /></button><span className="fav-kind">{p.kind || "Producto"}</span>{!p.available && <span className="fav-unavailable">{"No disponible"}</span>}<button type="button" className={"fav-heart" + (on ? " is-saved" : "")} aria-pressed={on} aria-label={`${on ? "Quitar de" : "Añadir a"} favoritos: ${p.name}`} onClick={ev => toggle(ev, p, on)}><Heart size={19} fill={on ? "currentColor" : "none"} /></button></div><div className="fav-info"><button type="button" className="fav-store" onClick={() => onStore(p.store)}>{p.store}<ArrowUpRight size={12} /></button><h3><button type="button" className="fav-name" onClick={() => onOpen(p.id)}>{p.name}</button></h3><div className="fav-meta"><strong>{offerPrice(p)}</strong><span>{p.category}</span></div>{rev.length > 0 && <Ratings reviews={rev} />}</div></article>;
      };
    return <section className="fav-view" aria-label="Tus favoritos">{mine.length > 0 ? <Fragment><div className="fav-bar"><p className="fav-summary" aria-live="polite"><span className="emp-heart fav-beat" aria-hidden="true" />{`${mine.length} ${plural(mine.length, "propuesta guardada", "propuestas guardadas")} de ${nStores} ${plural(nStores, "emprendimiento", "emprendimientos")}`}</p>{present.length > 1 && <div className="categories fav-filters" role="group" aria-label="Filtrar favoritos por categoría">{["Todos", ...present].map((c, ix) => <button type="button" aria-pressed={cat === c} className={cat === c ? "selected" : ""} onClick={() => onFilter({
              category: c
            })} key={c}>{ix === 0 && <LayoutGrid size={14} />}{c}<span className="emp-filter-count">{c === "Todos" ? mine.length : mine.filter(p => p.category === c).length}</span></button>)}</div>}</div><div className="fav-grid" key={cat}>{list.map((p, ix) => card(p, ix, !0))}</div></Fragment> : <Fragment><div className="fav-empty"><div className="fav-empty-art" aria-hidden="true"><span className="emp-heart fav-big" /><span className="emp-heart fav-sm s1" /><span className="emp-heart fav-sm s2" /><span className="emp-heart fav-sm s3" /></div><h2>{"Haz espacio para tus favoritos."}</h2><p>{"Toca el corazón de cualquier publicación y aparecerá aquí, esperándote."}</p><button type="button" className="fav-btn" onClick={() => onNavigate("catalog")}>{"Explorar propuestas"}<ArrowUpRight size={16} /></button></div>{suggestions.length > 0 && <div className="fav-suggest"><h2>{"Para empezar, mira estas."}</h2><div className="fav-grid">{suggestions.map((p, ix) => card(p, ix, !1))}</div></div>}</Fragment>}{gone.map(id => <div className="fav-gone" key={id}><span>{"Una publicación que guardaste ya no está disponible."}</span><button type="button" className="text-button" onClick={() => onFavorite(id)}>{"Quitar de favoritos"}</button></div>)}{mine.length > 0 && <div className="fav-more"><p>{"¿Quieres seguir descubriendo?"}</p><button type="button" className="fav-btn" onClick={() => onNavigate("catalog")}>{"Explorar propuestas"}<ArrowUpRight size={16} /></button></div>}</section>;
  })();
}
