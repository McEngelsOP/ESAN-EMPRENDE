'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { initialProducts } from '@/lib/data';
import { ProductImage } from './product-image';

const highlights = [
  { product: initialProducts[0], title: 'Una pausa con mucho chocolate.', description: 'Cookies y repostería para compartir entre clases. Conoce todo lo que prepara Miga & Mood.', short: 'El antojo entre clases', tone: 'cocoa' },
  { product: initialProducts[1], title: 'Lleva tu estilo a todas partes.', description: 'Accesorios y merchandising creados para acompañar tus días en la U. Descubre Entre Clases.', short: 'Estilo que va contigo', tone: 'sage' },
  { product: initialProducts[8], title: 'Tu idea merece estar en línea.', description: 'Páginas web y soluciones digitales para dar el siguiente paso con tu emprendimiento.', short: 'Soluciones tech', tone: 'digital' },
  { product: initialProducts[10], title: 'La próxima gran idea puede ser tuya.', description: 'Descubre proyectos en construcción y conecta con estudiantes que buscan colaboradores.', short: 'Ideas que nos conectan', tone: 'ideas' },
];
export function FeaturedShowcase({ onOpenStore }: { onOpenStore: (store: string) => void }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const playing = !paused && !interacting && !reduced && !hidden;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive(value => (value + 1) % highlights.length), 6000);
    return () => window.clearTimeout(timer);
  }, [active, playing]);
  const current = highlights[active];
  function select(index: number) { setActive((index + highlights.length) % highlights.length); }
  return <section className="featured" aria-label="Destacados de la comunidad" aria-roledescription="carrusel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setPaused(true)}>
    <div className="featured-heading"><div><h1>Descubre lo que nace en ESAN<span className="red">.</span></h1><p>Productos, servicios e ideas de tu comunidad.</p></div><span className="demo-label">Selección de ejemplo · Sin ventas registradas</span></div>
    <div className="featured-layout">
      <div className={`feature-stage ${current.tone}`} role="group" aria-roledescription="diapositiva" aria-label={`${active + 1} de ${highlights.length}`}>
        <div className="feature-visual" key={`image-${active}`}><ProductImage src={current.product.image} alt={current.product.name} sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 540px" preload={active===0}/></div>
        <div className="feature-copy" aria-live={playing?'off':'polite'} aria-atomic="true"><span className="feature-store">{current.product.store}</span><h2>{current.title}</h2><p>{current.description}</p><button className="primary" onClick={() => onOpenStore(current.product.store)}>Conocer emprendimiento <ArrowRight size={18}/></button></div>
        <div className="feature-controls"><span>{active + 1} / {highlights.length}</span><button aria-label="Destacado anterior" onClick={() => select(active - 1)}><ChevronLeft size={18}/></button><button aria-label="Siguiente destacado" onClick={() => select(active + 1)}><ChevronRight size={18}/></button><button aria-label={paused || reduced ? 'Reproducir destacados' : 'Pausar destacados'} onClick={() => { setPaused(!(paused || reduced)); setReduced(false); }}>{paused || reduced ? <Play size={16}/> : <Pause size={16}/>}</button></div>
      </div>
      <div className="feature-choices" role="group" aria-label="Elegir destacado">{highlights.map((item, index) => <button key={item.product.id} className={index === active ? 'feature-choice selected' : 'feature-choice'} aria-pressed={index === active} onClick={() => select(index)}><div className="feature-thumb"><ProductImage src={item.product.image} alt="" sizes="60px"/></div><span><strong>{item.product.store}</strong><small>{item.short}</small></span>{index === active && <span key={`${active}-${playing}`} className={`feature-progress ${playing ? 'running' : ''}`} aria-hidden="true"/>}</button>)}</div>
    </div>
  </section>;
}
