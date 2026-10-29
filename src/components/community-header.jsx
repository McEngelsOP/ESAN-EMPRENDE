"use client";

import React from "react";
import { Coffee, Shirt, Palette, Home, Code2, Lightbulb } from "lucide-react";
const kh = [Coffee, Shirt, Palette, Home, Code2, Lightbulb];
import { categories } from "@/lib/data";
import { Store } from "lucide-react";
import { Search } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Settings } from "lucide-react";
import { Menu } from "lucide-react";
export function CommunityHeader({
  business: business,
  saved: saved,
  route: route,
  onNavigate: onNavigate,
  onRoute: onRoute,
  search: search,
  onSearch: onSearch,
  accountOpen: accountOpen,
  onAccount: onAccount,
  mobileMenu: mobileMenu,
  onMobileMenu: onMobileMenu,
  onCatalog: onCatalog,
  base: base,
  preview: preview,
  authRequired = false
}) {
  return <header className="community-header"><div className="header-top"><a className="brand" href="#/inicio" onClick={h => {
        h.preventDefault(), onNavigate("catalog");
      }} aria-label="ESAN Emprende, inicio"><span className="brand-text"><b className="brand-esan">{"ESAN"}</b>{" "}<span className="brand-word">{"Emprende"}</span><i className="brand-orb" aria-hidden="true" /><small>{"Una comunidad que crea."}</small></span></a><form className="header-search" onSubmit={h => {
        h.preventDefault(), onRoute({
          ...base,
          view: "catalog",
          q: search
        }), onCatalog();
      }}><Search size={17} /><input aria-label="Buscar productos, servicios o marcas" placeholder="¿Qué estás buscando?" value={search} onChange={h => onSearch(h.target.value)} /><kbd className="search-kbd" aria-hidden="true">{"/"}</kbd><button className="icon-button" type="submit" aria-label="Buscar en la comunidad"><ArrowRight size={17} /></button><div className="search-suggest"><span className="suggest-title">{"Explora por categoría"}</span><div className="suggest-chips">{categories.slice(1).map((c, i) => {
              let Ic = kh[i];
              return <button type="button" style={{
                "--i": i
              }} onClick={() => {
                document.activeElement?.blur?.(), onRoute({
                  ...base,
                  view: "catalog",
                  category: c
                }), onCatalog();
              }} key={c}>{Ic && <Ic size={15} />}{c}</button>;
            })}</div></div></form><div className="header-actions"><div className="account-menu"><button className="account-avatar" aria-label="Abrir menú de cuenta" aria-haspopup="true" title="Mi cuenta" aria-expanded={accountOpen} onClick={() => onAccount(!accountOpen)}>{business?.name?.slice(0, 2).toUpperCase() || "EE"}</button>{accountOpen && <div className="account-popover" role="menu"><strong>{authRequired ? "Exploras como visitante" : business?.name || "Tu espacio"}</strong><small>{authRequired ? "El catálogo es público" : preview ? "Vista previa local" : "Cuenta institucional"}</small><button role="menuitem" className={route.view === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}><Store size={17} /><span>{authRequired ? "Crear o gestionar mi negocio" : "Mi negocio"}</span></button><button role="menuitem" className={route.view === "settings" ? "active" : ""} onClick={() => onNavigate("settings")}><Settings size={17} /><span>{"Ajustes generales"}</span></button></div>}</div><button className="mobile-toggle icon-button" onClick={() => onMobileMenu(!mobileMenu)} aria-label={mobileMenu ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={mobileMenu} aria-controls="community-navigation"><Menu size={22} /></button></div></div><div className="header-bottom"><nav id="community-navigation" className={mobileMenu ? "open" : ""} aria-label="Navegación principal">{[["catalog", "Inicio"], ["stores", "Emprendimientos"], ["saved", "Mis favoritos"]].map(([h, B]) => <button aria-current={route.view === h ? "page" : void 0} className={route.view === h ? "active" : ""} onClick={() => onNavigate(h)} key={h}>{B}{h === "saved" && saved.length > 0 && <span className="nav-count" aria-label={`${saved.length} guardados`}>{saved.length}</span>}</button>)}</nav><span className="nav-glider" aria-hidden="true" /></div></header>;
}
