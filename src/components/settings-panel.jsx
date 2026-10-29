"use client";

import React from "react";
import { Download } from "lucide-react";
import { Check } from "lucide-react";
import { parseWorkspace } from "@/lib/workspace";
import { Store } from "lucide-react";
import { ActionDialog } from "./action-dialog";
import { Settings } from "lucide-react";
import { Upload } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Eye } from "lucide-react";
export function SettingsPanel({
  authenticated = !1,
  authRequired = false,
  workspace: workspace,
  onImport: onImport,
  onClear: onClear
}) {
  let [n, i] = (0, React.useState)(""),
    [d, s] = (0, React.useState)(!1),
    [L, x] = (0, React.useState)(""),
    [f, p] = (0, React.useState)(""),
    y = (0, React.useRef)(null);
  function A() {
    let E = URL.createObjectURL(new Blob([JSON.stringify(workspace, null, 2)], {
        type: "application/json"
      })),
      m = document.createElement("a");
    m.href = E, m.download = "esan-emprende-datos.json", m.click(), setTimeout(() => URL.revokeObjectURL(E), 1e3), i("Copia descargada. Puedes importarla en otro navegador.");
  }
  const [sxEx, sxSetEx] = (0, React.useState)(!1),
    [sxDr, sxSetDr] = (0, React.useState)(!1),
    [sxAct, sxSetAct] = (0, React.useState)("cuenta"),
    [sxP, sxSetP] = (0, React.useState)(0),
    sxBar = (0, React.useRef)(null),
    sxLock = (0, React.useRef)(0),
    sxLast = (0, React.useRef)("");
  n && (sxLast.current = n);
  (0, React.useEffect)(() => {
    if (!n) return;
    let q = setTimeout(() => i(""), 5200);
    return () => clearTimeout(q);
  }, [n]);
  (0, React.useEffect)(() => {
    let red = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches,
      els = [...document.querySelectorAll(".sx-card")];
    const go = () => {
      if (red) {
        sxSetP(1);
        return;
      }
      let t0 = performance.now(),
        tick = now => {
          let k = Math.min(1, (now - t0) / 1000);
          sxSetP(1 - Math.pow(1 - k, 3)), k < 1 && requestAnimationFrame(tick);
        };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in")), sxSetP(1);
      return;
    }
    let io = new IntersectionObserver(en => en.forEach(x => {
        if (x.isIntersecting) {
          x.target.classList.add("in"), x.target.id === "sx-datos" && go(), io.unobserve(x.target);
        }
      }), {
        threshold: .1
      }),
      sp = new IntersectionObserver(en => en.forEach(x => {
        x.isIntersecting && Date.now() > sxLock.current && sxSetAct(x.target.id.slice(3));
      }), {
        rootMargin: "-30% 0px -60% 0px"
      });
    els.forEach(el => {
      io.observe(el), sp.observe(el);
    });
    return () => {
      io.disconnect(), sp.disconnect();
    };
  }, []);
  (0, React.useEffect)(() => {
    let bar = sxBar.current;
    if (!bar) return;
    let bt = bar.querySelector("[data-k=\"" + sxAct + "\"]");
    if (!bt) return;
    bar.style.setProperty("--ix", bt.offsetLeft + "px"), bar.style.setProperty("--iw", bt.offsetWidth + "px"), bar.scrollWidth > bar.clientWidth && bar.scrollTo({
      left: bt.offsetLeft - bar.clientWidth / 2 + bt.offsetWidth / 2,
      behavior: "smooth"
    });
  }, [sxAct]);
  return <section className="settings-page sx-page"><div className="sx-hero"><span className="sx-eyebrow">{"Ajustes"}</span><h1 className="sx-title"><span className="sx-w" style={{
          "--i": 0
        }}>{"Tu "}</span><span className="sx-w" style={{
          "--i": 1
        }}>{"espacio, "}</span><span className="sx-w" style={{
          "--i": 2
        }}>{"a "}</span><span className="sx-w" style={{
          "--i": 3
        }}>{"tu "}</span><span className="sx-w" style={{
          "--i": 4
        }}>{"manera."}</span></h1><p className="sx-sub">{"Gestiona tu espacio y conserva lo que has creado."}</p></div><div className="sx-tabswrap"><div className="sx-tabs" ref={sxBar} role="group" aria-label="Secciones de ajustes"><span className="sx-ind" aria-hidden="true" /><button type="button" className="sx-tab" data-k="cuenta" aria-current={sxAct === "cuenta" ? "true" : void 0} onClick={() => {
          sxLock.current = Date.now() + 1200, sxSetAct("cuenta"), document.getElementById("sx-cuenta")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}>{"Cuenta"}</button><button type="button" className="sx-tab" data-k="datos" aria-current={sxAct === "datos" ? "true" : void 0} onClick={() => {
          sxLock.current = Date.now() + 1200, sxSetAct("datos"), document.getElementById("sx-datos")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}>{"Datos"}</button><button type="button" className="sx-tab" data-k="peligro" aria-current={sxAct === "peligro" ? "true" : void 0} onClick={() => {
          sxLock.current = Date.now() + 1200, sxSetAct("peligro"), document.getElementById("sx-peligro")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}>{"Riesgo"}</button><button type="button" className="sx-tab" data-k="ayuda" aria-current={sxAct === "ayuda" ? "true" : void 0} onClick={() => {
          sxLock.current = Date.now() + 1200, sxSetAct("ayuda"), document.getElementById("sx-ayuda")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}>{"Ayuda"}</button><button type="button" className="sx-tab" data-k="sobre" aria-current={sxAct === "sobre" ? "true" : void 0} onClick={() => {
          sxLock.current = Date.now() + 1200, sxSetAct("sobre"), document.getElementById("sx-sobre")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}>{"Acerca de"}</button></div></div><div className="sx-grid" onPointerMove={E => {
      let c = E.target.closest && E.target.closest(".sx-card");
      if (c) {
        let r = c.getBoundingClientRect();
        c.style.setProperty("--mx", E.clientX - r.left + "px"), c.style.setProperty("--my", E.clientY - r.top + "px");
      }
    }}><section className="sx-card sx-c12" id="sx-cuenta" style={{
        "--d": "0ms"
      }}><div className="sx-head"><span className="sx-ico" aria-hidden="true"><Settings size={20} /></span><div><h2>{"Cuenta"}</h2><p>{authenticated ? "Sesión institucional verificada." : "Vista previa sin iniciar sesión."}</p></div></div><div className="sx-body"><span className={"sx-pill" + (authenticated ? " ok" : "")}><i /><b>{authenticated ? "Verificada" : "Sin sesión"}</b></span><p className="sx-note">{authenticated ? "Para cambiar de cuenta, cierra la sesión desde la cabecera e ingresa con el otro correo institucional." : authRequired ? "Verifica tu correo institucional para crear o gestionar tu negocio y publicar." : "Esta vista previa funciona sin iniciar sesión. Tus datos se guardan en este navegador."}</p></div></section><section className="sx-card sx-c12" id="sx-datos" style={{
        "--d": "0ms"
      }}><div className="sx-head"><span className="sx-ico" aria-hidden="true"><Download size={20} /></span><div><h2>{"Tus datos de demostración"}</h2><p>{"Publicaciones, perfil, favoritos y reseñas se guardan en este navegador."}</p></div></div><div className="sx-body"><div className="sx-stats"><div className="sx-stat"><strong>{Math.round((workspace?.products?.length || 0) * sxP)}</strong><span>{"Publicaciones"}</span></div><div className="sx-stat"><strong>{Math.round((workspace?.saved?.length || 0) * sxP)}</strong><span>{"Favoritos"}</span></div><div className="sx-stat"><strong>{Math.round((workspace?.reviews?.length || 0) * sxP)}</strong><span>{"Reseñas"}</span></div><div className="sx-stat"><strong>{workspace?.business ? "Creado" : "Sin crear"}</strong><span>{"Perfil"}</span></div></div><div className="sx-tiles"><button type="button" className={"sx-tile" + (sxEx ? " done" : "")} onClick={() => {
              A(), sxSetEx(!0), setTimeout(() => sxSetEx(!1), 1900);
            }}><span className="sx-tile-ic"><span className="ia"><Download size={22} /></span><span className="ib"><Check size={22} /></span></span><strong>{sxEx ? "¡Copia descargada!" : "Exportar datos"}</strong><span>{"Descarga una copia en JSON antes de cambiar de dispositivo."}</span></button><div className={"sx-tile drop" + (sxDr ? " over" : "")} role="button" tabIndex={0} aria-label="Importar datos: elige un archivo o suéltalo aquí" onClick={() => y.current?.click()} onKeyDown={E => {
              (E.key === "Enter" || E.key === " ") && (E.preventDefault(), y.current?.click());
            }} onDragOver={E => {
              E.preventDefault(), sxSetDr(!0);
            }} onDragEnter={E => {
              E.preventDefault(), sxSetDr(!0);
            }} onDragLeave={() => sxSetDr(!1)} onDrop={E => {
              E.preventDefault(), sxSetDr(!1);
              let m = E.dataTransfer.files;
              m && m.length && y.current && (y.current.files = m, y.current.dispatchEvent(new Event("change", {
                bubbles: !0
              })));
            }}><span className="sx-tile-ic"><span className="ia"><Upload size={22} /></span></span><strong>{sxDr ? "Suéltalo para importar" : "Importar datos"}</strong><span>{"Elige o arrastra aquí un archivo JSON de hasta 10 MB."}</span></div><input ref={y} type="file" accept="application/json,.json" hidden={!0} aria-label="Archivo de datos de ESAN Emprende" onChange={async E => {
              let m = E.target.files?.[0];
              if (m) {
                try {
                  if (m.size > 10 * 1024 * 1024) throw Error("too large");
                  let c = parseWorkspace(await m.text()),
                    g = onImport(c);
                  i(g ? "Importación completada. Tus registros anteriores se conservaron." : "No se importó: el almacenamiento original necesita recuperarse primero.");
                } catch {
                  i("No se pudo importar. Elige un JSON de ESAN Emprende de hasta 10 MB.");
                }
                E.target.value = "";
              }
            }} /></div><p className="sx-note">{"Importar añade registros nuevos y conserva los actuales cuando coinciden los identificadores. Si ya tienes un perfil, se mantiene ese perfil."}</p></div></section><section className="sx-card sx-c12 danger" id="sx-peligro" style={{
        "--d": "0ms"
      }}><div className="sx-head"><span className="sx-ico" aria-hidden="true"><Trash2 size={20} /></span><div><h2>{"Zona de riesgo"}</h2><p>{"Elimina el perfil, publicaciones, favoritos y reseñas guardados en el espacio de esta vista previa."}</p></div></div><div className="sx-body sx-row"><p className="sx-note">{"No borra copias anteriores ni datos de otros sitios. Te pediremos confirmación y podrás exportar una copia antes."}</p><button type="button" className="sx-danger" onClick={() => {
            s(!0), p(""), x("");
          }}><Trash2 size={16} /><span>{"Eliminar datos locales"}</span></button></div></section><section className="sx-card sx-c8" id="sx-ayuda" style={{
        "--d": "0ms"
      }}><div className="sx-head"><span className="sx-ico" aria-hidden="true"><Eye size={20} /></span><div><h2>{"Ayuda y privacidad"}</h2><p>{"Guías rápidas y reglas de esta versión."}</p></div></div><div className="sx-body sx-acc"><details><summary>{"Centro de ayuda"}</summary><p>{"Para crear una tienda, abre Mi negocio y completa el perfil. Después añade una publicación, revisa su vista previa y confirma el guardado. Puedes editar precios, marcar productos agotados y exportar una copia desde Ajustes."}</p><p>{"Las publicaciones se guardan solo en este navegador. Un enlace público y los datos entre dispositivos estarán disponibles cuando conectemos Supabase."}</p></details><details><summary>{"Privacidad de esta versión"}</summary><p>{"El perfil, las publicaciones, las imágenes, los favoritos y las reseñas que añades se guardan localmente en este navegador. Exportar crea un archivo que tú puedes conservar. Eliminar datos locales borra el espacio de esta vista; otras copias permanecen."}</p><p>{"Los enlaces de WhatsApp, correo y redes sociales abren servicios externos. Evita añadir información sensible. Esta explicación describe la demo actual; la política del servicio conectado debe definirse antes de su lanzamiento."}</p></details><details><summary>{"Reglas de la comunidad"}</summary><p>{"Publica contenido propio o autorizado, describe con claridad lo que ofreces y verifica los canales de contacto. No publiques datos de otras personas sin permiso. La versión actual no procesa pagos ni verifica compras."}</p><p>{"Las reglas y los mecanismos de moderación del servicio público siguen pendientes de aprobación."}</p></details></div></section><section className="sx-card sx-c4" id="sx-sobre" style={{
        "--d": "90ms"
      }}><div className="sx-head"><span className="sx-ico" aria-hidden="true"><Store size={20} /></span><div><h2>{"Sobre esta versión"}</h2><p>{"Prototipo independiente para estudiantes de ESAN."}</p></div></div><div className="sx-body"><p className="sx-note">{authRequired ? "Verifica tu correo institucional para gestionar tu negocio. No se procesan pagos ni se gestionan entregas." : "No se procesan pagos ni se gestionan pedidos o entregas."}</p><p className="sx-note">{"Los enlaces de contacto abren servicios externos; revisa los datos antes de escribir. Las reseñas no acreditan compras."}</p></div></section></div>{d && <ActionDialog title="¿Eliminar los datos de esta vista?" onClose={() => s(!1)}><p>{"Esta acción no se puede deshacer. Puedes exportar una copia antes."}</p>{L && <p role="alert" className="field-error">{L}</p>}<button className="secondary" onClick={A}><Download size={16} />{" Exportar una copia primero"}</button><label className="clear-confirm-label">{"Escribe ELIMINAR para confirmar"}<input value={f} onChange={E => p(E.target.value)} /></label><div className="seller-actions"><button className="secondary" onClick={() => s(!1)}>{"Cancelar"}</button><button className="danger-button" disabled={f !== "ELIMINAR"} onClick={() => {
          onClear() ? (s(!1), i("Datos de esta vista eliminados.")) : x("No pudimos eliminar los datos. Inténtalo de nuevo.");
        }}>{"Eliminar datos"}</button></div></ActionDialog>}<div className={"sx-toast" + (n ? " show" : "")} role="status" aria-live="polite"><span className="sx-toast-ic" aria-hidden="true"><Check size={14} /></span><span>{sxLast.current}</span></div></section>;
}
