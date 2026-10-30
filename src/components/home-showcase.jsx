"use client";

import React from "react";
import { ProductImage } from "./product-image";
import { initialProducts } from "@/lib/data";
import { Coffee } from "lucide-react";
import { Shirt } from "lucide-react";
import { Palette } from "lucide-react";
import { House } from "lucide-react";
import { CodeXml } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ArrowRight } from "lucide-react";
var HV_SCENE = "<svg class=\"hv-cloud c1\" viewBox=\"0 0 200 80\" width=\"190\"><g fill=\"#fff\"><ellipse cx=\"100\" cy=\"56\" rx=\"86\" ry=\"18\"/><circle cx=\"62\" cy=\"42\" r=\"22\"/><circle cx=\"98\" cy=\"32\" r=\"28\"/><circle cx=\"138\" cy=\"44\" r=\"20\"/></g></svg><svg class=\"hv-cloud c2\" viewBox=\"0 0 200 80\" width=\"130\"><g fill=\"#fff\"><ellipse cx=\"100\" cy=\"56\" rx=\"86\" ry=\"18\"/><circle cx=\"62\" cy=\"42\" r=\"22\"/><circle cx=\"98\" cy=\"32\" r=\"28\"/><circle cx=\"138\" cy=\"44\" r=\"20\"/></g></svg><svg class=\"hv-cloud c3\" viewBox=\"0 0 200 80\" width=\"90\"><g fill=\"#fff\"><ellipse cx=\"100\" cy=\"56\" rx=\"86\" ry=\"18\"/><circle cx=\"62\" cy=\"42\" r=\"22\"/><circle cx=\"98\" cy=\"32\" r=\"28\"/><circle cx=\"138\" cy=\"44\" r=\"20\"/></g></svg><svg class=\"hv-hill h1\" viewBox=\"0 0 1440 260\" preserveAspectRatio=\"xMidYMax slice\"><path class=\"mt\" d=\"M0 150 L90 108 L170 138 L290 78 L390 128 L480 100 L610 150 L730 90 L850 140 L970 84 L1090 140 L1210 100 L1330 140 L1440 112 L1440 260 L0 260Z\"/></svg><svg class=\"hv-hill h2\" viewBox=\"0 0 1440 260\" preserveAspectRatio=\"xMidYMax slice\"><path class=\"md\" d=\"M0 165 C200 110 380 145 560 128 C760 110 980 156 1180 124 C1300 106 1380 122 1440 134 L1440 260 L0 260Z\"/></svg><svg class=\"hv-hill h3\" viewBox=\"0 0 1440 260\" preserveAspectRatio=\"xMidYMax slice\"><path class=\"fr\" d=\"M0 150 C180 128 380 124 600 140 C840 158 1100 146 1440 126 L1440 260 L0 260Z\"/><path class=\"st\" d=\"M40 190 C300 170 520 176 760 188 M120 215 C380 196 640 204 900 214 M600 175 C860 168 1100 176 1340 160 M900 236 C1100 224 1280 226 1420 214\" fill=\"none\"/></svg><svg class=\"hv-tree\" viewBox=\"0 0 120 120\" width=\"84\"><ellipse cx=\"60\" cy=\"112\" rx=\"40\" ry=\"6\" fill=\"#2a4a2c\" opacity=\".5\"/><g class=\"sway\"><rect x=\"56\" y=\"62\" width=\"8\" height=\"50\" rx=\"3\" fill=\"#3b2a1c\"/><circle cx=\"60\" cy=\"40\" r=\"30\" fill=\"#2f5a33\"/><circle cx=\"38\" cy=\"54\" r=\"22\" fill=\"#3d6d3a\"/><circle cx=\"84\" cy=\"54\" r=\"22\" fill=\"#3d6d3a\"/><circle cx=\"62\" cy=\"24\" r=\"20\" fill=\"#4d8043\"/><circle cx=\"46\" cy=\"36\" r=\"12\" fill=\"#5a9049\" opacity=\".8\"/></g></svg>";
var hvTc = ["#b3432f", "#a8514a", "#8f6410", "#3f6b3d", "#2f6a86", "#bd302f"];
var hvIc = {
    "Comida y bebidas": Coffee,
    "Moda y accesorios": Shirt,
    "Arte y papelería": Palette,
    "Hogar y bienestar": House,
    "Soluciones tech": CodeXml,
    "Servicios": Lightbulb
  },
  hvToneIc = {
    cocoa: Coffee,
    sage: Shirt,
    digital: CodeXml,
    ideas: Lightbulb
  },
  hvWords = ["delicioso", "con estilo", "útil", "nuevo", "tuyo"],
  hvBg = ["#f3dfcb", "#dbe8d6", "#d6e6ea", "#f3e6bd", "#ecd5d8", "#e0dcef"],
  hvh = React.createElement;
function hvRm() {
  let [a, b] = React.useState(!1);
  return React.useEffect(() => {
    let m = window.matchMedia("(prefers-reduced-motion: reduce)"),
      f = () => b(m.matches);
    return f(), m.addEventListener("change", f), () => m.removeEventListener("change", f);
  }, []), a;
}
function hvHidden() {
  let [a, b] = React.useState(!1);
  return React.useEffect(() => {
    let f = () => b(document.hidden);
    return f(), document.addEventListener("visibilitychange", f), () => document.removeEventListener("visibilitychange", f);
  }, []), a;
}
function hvStores(items = initialProducts) {
  let m = new Map();
  return items.forEach(p => {
    let x = m.get(p.store);
    x || (x = {
      name: p.store,
      owner: p.owner,
      category: p.category,
      n: 0
    }, m.set(p.store, x)), x.n++;
  }), [...m.values()];
}
function hvSpot(e) {
  let r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px"), e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
}
function hvMag(e) {
  if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let t = e.currentTarget,
    r = t.getBoundingClientRect();
  t.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
}
function hvMagOut(e) {
  e.currentTarget.style.transform = "";
}
function HvNum({
  to: to,
  rm: rm
}) {
  let [c, d] = React.useState(rm ? to : 0);
  return React.useEffect(() => {
    if (rm) {
      d(to);
      return;
    }
    let r,
      s = performance.now(),
      f = x => {
        let k = Math.min(1, (x - s) / 1400);
        d(Math.round(to * (1 - Math.pow(1 - k, 3)))), k < 1 && (r = requestAnimationFrame(f));
      };
    return r = requestAnimationFrame(f), () => cancelAnimationFrame(r);
  }, [to, rm]), c;
}
function hvReveal(ref, rm) {
  React.useEffect(() => {
    let r = ref.current;
    if (!r) return;
    let els = [...r.querySelectorAll(".hv-rv")];
    if (rm || !("IntersectionObserver" in window)) {
      els.forEach(x => x.classList.add("in"));
      return;
    }
    let io = new IntersectionObserver(es => es.forEach(x => {
      x.isIntersecting && (x.target.classList.add("in"), io.unobserve(x.target));
    }), {
      threshold: .14,
      rootMargin: "0px 0px -5% 0px"
    });
    return els.forEach(x => {
      x.classList.add("hv-rv-on"), io.observe(x);
    }), () => io.disconnect();
  }, [rm]);
}
function HvRail({
  onOpen: onOpen,
  rm: rm,
  products = initialProducts
}) {
  let stores = React.useMemo(() => hvStores(products), [products]),
    ref = React.useRef(null),
    drag = React.useRef({
      on: !1,
      x: 0,
      l: 0,
      m: !1
    }),
    [dg, setDg] = React.useState(!1),
    [pr, setPr] = React.useState({
      sp: 0,
      w: 1
    });
  let upd = () => {
    let el = ref.current;
    if (!el) return;
    let max = el.scrollWidth - el.clientWidth;
    setPr({
      sp: max > 0 ? el.scrollLeft / max : 0,
      w: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1
    });
  };
  React.useEffect(() => (upd(), window.addEventListener("resize", upd), () => window.removeEventListener("resize", upd)), []);
  let by = d => ref.current && ref.current.scrollBy({
    left: d * Math.max(280, ref.current.clientWidth * .7),
    behavior: rm ? "auto" : "smooth"
  });
  let end = () => {
    drag.current.on && (drag.current.on = !1, setDg(!1));
  };
  return <section className="hv-sec hv-rv" aria-label="Emprendimientos de la comunidad"><div className="hv-head"><div><h2>{"Conoce a quienes crean."}</h2><p>{"Desliza o arrastra para descubrir emprendimientos de tu comunidad."}</p></div><div className="hv-arrows"><button type="button" aria-label="Ver anteriores" onClick={() => by(-1)}><ChevronLeft size={20} /></button><button type="button" aria-label="Ver siguientes" onClick={() => by(1)}><ChevronRight size={20} /></button></div></div><div className={"hv-rail" + (dg ? " drag" : "")} ref={ref} onScroll={upd} onPointerDown={ev => {
      ev.pointerType === "mouse" && ev.button === 0 && (drag.current = {
        on: !0,
        x: ev.clientX,
        l: ref.current.scrollLeft,
        m: !1
      });
    }} onPointerMove={ev => {
      let d = drag.current;
      if (!d.on) return;
      let dx = ev.clientX - d.x;
      Math.abs(dx) > 5 && !d.m && (d.m = !0, setDg(!0)), d.m && (ref.current.scrollLeft = d.l - dx);
    }} onPointerUp={end} onPointerLeave={end} onClickCapture={ev => {
      drag.current.m && (ev.preventDefault(), ev.stopPropagation(), drag.current.m = !1);
    }}>{stores.map((s, i) => {
        let Ic = hvIc[s.category] || Lightbulb;
        return <button key={s.name} type="button" className="hv-store" data-category={s.category} style={{
          "--bg": hvBg[i % hvBg.length],
          "--c": hvTc[(i + 3) % hvTc.length]
        }} onPointerMove={hvSpot} onClick={() => onOpen(s.name)}><span className="hv-av">{s.name[0]}</span><span className="hv-go2" aria-hidden="true"><ArrowUpRight size={18} /></span><span className="hv-sname">{s.name}</span><span className="hv-sown">{"por " + s.owner}</span><span className="hv-stag"><Ic size={14} strokeWidth={1.75} />{s.category}</span><span className="hv-scount">{s.n + (s.n === 1 ? " propuesta" : " propuestas")}</span></button>;
      })}</div><div className="hv-prog" aria-hidden="true"><i style={{
        "--sp": pr.sp,
        "--w": pr.w
      }} /></div></section>;
}
function HvCats({
  counts: counts,
  onCategory: onCategory,
  onAll: onAll
}) {
  return <section className="hv-sec" aria-label="Explorar por categoría"><div className="hv-head hv-rv"><div><h2>{"Hay algo para cada idea."}</h2><p>{"Elige una categoría y mira qué hay."}</p></div><button type="button" className="hv-more" onClick={onAll}>{"Ver todo"}<ArrowUpRight size={16} /></button></div><div className="hv-tiles">{categories.slice(1).map((n, i) => {
        let Ic = hvIc[n] || Lightbulb;
        return <div key={n} className="hv-rv" style={{
          "--i": i,
          "--c": hvTc[i % hvTc.length]
        }}><button type="button" className="hv-tile" onPointerMove={hvSpot} onClick={() => onCategory(n)}><span className="hv-tic"><Ic size={24} strokeWidth={1.5} /></span><span className="hv-ttx"><strong>{n}</strong><small>{(counts[i] || 0) + " propuestas"}</small></span><ArrowUpRight size={18} className="hv-tar" /></button></div>;
      })}</div></section>;
}
export function HomeShowcase({
  onOpenStore: onOpenStore,
  onExplore: onExplore,
  onStores: onStores,
  onCategory: onCategory,
  counts: counts,
  products = initialProducts
}) {
  const slides = React.useMemo(() => {
    const live = products.filter(p => p.available);
    const picked = [live.find(p => p.category === 'Comida y bebidas'), live.find(p => p.category === 'Moda y accesorios'), live.find(p => p.kind === 'Servicio'), live.find(p => p.kind === 'Idea')];
    const unique = [...new Map([...picked, ...live].filter(Boolean).map(p => [p.id,p])).values()].slice(0,4);
    return unique.map(p => ({product:p,title:p.name,short:p.kind==='Idea'?'Una idea que busca equipo':p.kind==='Servicio'?'Talento de nuestra comunidad':p.category,tone:p.kind==='Idea'?'ideas':p.kind==='Servicio'?'digital':p.category==='Comida y bebidas'?'cocoa':'sage'}));
  }, [products]);
  let rm = hvRm(),
    hid = hvHidden(),
    root = React.useRef(null),
    hero = React.useRef(null),
    tg = React.useRef({
      x: 0,
      y: 0
    }),
    cu = React.useRef({
      x: 0,
      y: 0
    }),
    raf = React.useRef(0),
    [a, setA] = React.useState(0),
    [hold, setHold] = React.useState(!1),
    [paused, setPaused] = React.useState(!1),
    [wi, setWi] = React.useState(0),
    n = Math.max(1,slides.length),
    play = !rm && !hold && !hid && !paused,
    nStores = React.useMemo(() => hvStores(products).length, [products]);
  hvReveal(root, rm);
  React.useEffect(() => {
    if (!play || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = setTimeout(() => setA(x => (x + 1) % n), 5200);
    return () => clearTimeout(t);
  }, [a, play, n, slides.length]);
  React.useEffect(() => {
    if (rm || hid || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = setInterval(() => setWi(x => (x + 1) % hvWords.length), 2600);
    return () => clearInterval(t);
  }, [rm, hid, paused]);
  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);
  let kick = () => {
    if (raf.current) return;
    let f = () => {
      let c = cu.current,
        t = tg.current,
        el = hero.current;
      if (!el) {
        raf.current = 0;
        return;
      }
      c.x += (t.x - c.x) * .07, c.y += (t.y - c.y) * .07, el.style.setProperty("--px", c.x.toFixed(3)), el.style.setProperty("--py", c.y.toFixed(3)), Math.abs(t.x - c.x) > .002 || Math.abs(t.y - c.y) > .002 ? raf.current = requestAnimationFrame(f) : raf.current = 0;
    };
    raf.current = requestAnimationFrame(f);
  };
  let mv = ev => {
    if (rm || ev.pointerType === "touch") return;
    let el = hero.current,
      r = el.getBoundingClientRect(),
      x = (ev.clientX - r.left) / r.width,
      y = (ev.clientY - r.top) / r.height;
    el.style.setProperty("--gx", x * 100 + "%"), el.style.setProperty("--gy", y * 100 + "%"), tg.current = {
      x: x * 2 - 1,
      y: y * 2 - 1
    }, kick();
  };
  let lv = () => {
    tg.current = {
      x: 0,
      y: 0
    }, kick();
  };
  let cats = categories.slice(1),
    tick = [...cats, ...cats];
  return <div className={"hv" + (paused ? " is-paused" : "")} ref={root}><section className="hv-hero" ref={hero} aria-label="Bienvenida" onPointerMove={mv} onPointerLeave={lv}><i className="hv-blob b1" aria-hidden="true" /><i className="hv-blob b2" aria-hidden="true" /><i className="hv-blob b3" aria-hidden="true" /><div className="hv-scene" aria-hidden="true" dangerouslySetInnerHTML={{
        __html: HV_SCENE
      }} /><div className="hv-copy"><h1 className="hv-title hv-in" style={{
          "--i": 1
        }} aria-label="Descubre algo nuevo en tu comunidad ESAN"><span aria-hidden="true">{"Descubre algo"}</span><span className="hv-wordwrap" aria-hidden="true"><span className="hv-word" key={wi}>{hvWords[wi] + "."}</span></span></h1><p className="hv-lead hv-in" style={{
          "--i": 2
        }}>{"Lo que nace en ESAN, en un solo lugar: productos, servicios e ideas de tu comunidad."}</p><div className="hv-cta hv-in" style={{
          "--i": 3
        }}><button type="button" className="hv-btn solid" onClick={onExplore} onPointerMove={hvMag} onPointerLeave={hvMagOut}>{"Explorar propuestas"}<ArrowRight size={18} /></button><button type="button" className="hv-btn line" onClick={onStores} onPointerMove={hvMag} onPointerLeave={hvMagOut}>{"Ver emprendimientos"}</button></div><div className="hv-community-summary"><span><strong>{products.length}</strong> propuestas</span><span><strong>{nStores}</strong> emprendimientos</span><span><strong>{cats.length}</strong> categorías</span></div><span className="hv-demo hv-in" style={{
          "--i": 5
        }}>{"Selección de ejemplo · Sin ventas registradas"}</span></div><div className="hv-stage" onMouseEnter={() => setHold(!0)} onMouseLeave={() => setHold(!1)} onFocusCapture={() => setPaused(true)}><i className="hv-ring r1" aria-hidden="true" /><i className="hv-ring r2" aria-hidden="true" /><div className="hv-stack" role="group" aria-roledescription="carrusel" aria-label="Destacados de la comunidad">{slides.map((s, i) => {
            let r = (i - a % n + n) % n,
              Ic = hvToneIc[s.tone] || Lightbulb;
            return <button key={s.product.id} type="button" className="hv-card" data-r={r} aria-label={(r === 0 ? "Conocer " : "Ver ") + s.product.store + ": " + s.short} onClick={() => r === 0 ? onOpenStore(s.product.store) : setA(i)}><span className={"hv-card-in hv-t-" + s.tone} style={{
                "--d": i * -1.4 + "s"
              }}>{s.product.image && !['tech','idea'].includes(s.product.image) ? <span className="hv-feature-media"><ProductImage src={s.product.image} alt={s.product.name} sizes="(max-width:760px) 240px, 320px" preload={i===0}/></span> : <Ic className="hv-bigic" size={140} strokeWidth={.9} aria-hidden="true" />}<span className="hv-card-top"><span className="hv-ic"><Ic size={26} strokeWidth={1.6} /></span><span className="hv-chip">{s.product.store}</span></span><span className="hv-card-bot"><span className="hv-h">{s.title}</span><span className="hv-p">{s.short}</span><span className="hv-go">{"Conocer emprendimiento"}<ArrowUpRight size={16} /></span></span></span></button>;
          })}{!slides.length&&<div className="hv-no-feature"><Lightbulb size={42}/><h2>El espacio está listo para tu idea.</h2><p>Crea una propuesta o restaura los ejemplos desde Ajustes.</p></div>}</div>{slides.length>1&&<><button type="button" className="hv-pause" onClick={() => setPaused(v => !v)} aria-pressed={paused} aria-label={paused ? "Reanudar destacados" : "Pausar destacados"}>{hvh(paused ? Play : Pause, {
            size: 16
          })}</button><div className="hv-dots" role="group" aria-label="Elegir destacado">{slides.map((s, i) => <button key={i} type="button" aria-label={"Ver " + s.product.store} aria-pressed={i === a % n} className={i === a % n ? "on" : ""} onClick={() => setA(i)}><i key={a + "-" + play} className={play && i === a % n ? "run" : ""} /></button>)}</div></>}</div><div className="hv-ticker" aria-hidden="true"><div className="hv-ticker-track">{tick.map((c, i) => <span key={i}><b />{c}</span>)}</div></div></section><HvRail onOpen={onOpenStore} rm={rm} products={products} /></div>;
}
export function HomeEnding({
  onServices: onServices,
  onIdeas: onIdeas,
  onJoin: onJoin,
  counts: counts,
  onCategory: onCategory,
  onAll: onAll
}) {
  let root = React.useRef(null),
    rm = hvRm();
  hvReveal(root, rm);
  return <div className="hv" ref={root}><section className="hv-duo"><div className="hv-rv" style={{
        "--i": 0
      }}><button type="button" className="hv-feat a" onPointerMove={hvSpot} onClick={onServices}><CodeXml className="big" strokeWidth={.8} aria-hidden="true" /><span className="hv-fh">{"El talento también se comparte."}</span><span className="hv-fp">{"Encuentra a alguien que le dé forma a tu próxima idea."}</span><span className="hv-fgo">{"Descubrir servicios"}<ArrowUpRight size={18} /></span></button></div><div className="hv-rv" style={{
        "--i": 1
      }}><button type="button" className="hv-feat b" onPointerMove={hvSpot} onClick={onIdeas}><Lightbulb className="big" strokeWidth={.8} aria-hidden="true" /><span className="hv-fh">{"Lo que viene puede empezar contigo."}</span><span className="hv-fp">{"Ideas que buscan nuevas miradas y colaboradores."}</span><span className="hv-fgo">{"Conocer ideas"}<ArrowUpRight size={18} /></span></button></div></section><HvCats counts={counts} onCategory={onCategory} onAll={onAll} /><section className="hv-join hv-rv"><i className="hv-jc c1" aria-hidden="true" /><i className="hv-jc c2" aria-hidden="true" /><div className="hv-jt"><h2>{"Algo tuyo merece estar aquí."}</h2><p>{"Dale un espacio a lo que estás creando. Tu comunidad te espera."}</p></div><button type="button" className="hv-btn solid" onClick={onJoin} onPointerMove={hvMag} onPointerLeave={hvMagOut}>{"Crear mi emprendimiento"}<ArrowUpRight size={18} /></button></section></div>;
}
export function HvProductMedia({
  product: product
}) {
  let Icon = hvIc[product.category] || Lightbulb;
  return <span className="discovery-art" role="img" aria-label={product.name}><Icon size={78} strokeWidth={1.2} aria-hidden="true" /><span aria-hidden="true">{product.category}</span></span>;
}
