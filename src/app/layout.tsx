import type { Metadata } from 'next';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import './globals.css';
import './discovery-refinements.css';
import './workspace-refinements.css';
import './experience-refinements.css';

export const metadata: Metadata = { title: 'ESAN Emprende · Hecho en tu comunidad', description: 'Prototipo del catálogo de emprendimientos de estudiantes de ESAN.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" data-theme="light" style={{colorScheme:'light'}} suppressHydrationWarning><body>{children}</body></html>; }
