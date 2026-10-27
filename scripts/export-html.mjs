import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const output=path.join(root,'public/downloads/esan-emprende-local.html');
const photos={};
for(const name of ['cookies','bag','plant','jewelry','coffee','notebook'])photos[`/images/demo-v1/${name}.webp`]='data:image/webp;base64,'+(await readFile(path.join(root,'public/images/demo-v1',name+'.webp'))).toString('base64');
const shim=`import React from 'react';const photos=${JSON.stringify(photos)};export default function LocalImage({src,alt,fill,style,preload}){return <img src={photos[src]||photos['/images/demo-v1/cookies.webp']} alt={alt||''} loading={preload?'eager':'lazy'} decoding="async" style={{position:'absolute',inset:0,width:'100%',height:'100%',...style}}/>}`;
const bundled=await build({
 stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import Marketplace from './src/components/marketplace';createRoot(document.getElementById('app')).render(<Marketplace accountId="standalone-preview" preview/>);`,resolveDir:root,loader:'tsx'},
 bundle:true,write:false,minify:true,format:'iife',platform:'browser',target:['es2020'],jsx:'automatic',nodePaths:[path.join(root,'node_modules')],tsconfig:path.join(root,'tsconfig.json'),define:{'process.env.NODE_ENV':'"production"'},
 plugins:[{name:'standalone-html',setup(b){
  b.onResolve({filter:/^next\/image$/},()=>({path:'local-image',namespace:'standalone'}));
  b.onLoad({filter:/.*/,namespace:'standalone'},()=>({contents:shim,loader:'tsx',resolveDir:root}));
  b.onLoad({filter:/marketplace\.tsx$/},async(args)=>{let source=await readFile(args.path,'utf8');source=source.replace('href="/" aria-label="ESAN Emprende, inicio"','href="#" onClick={e=>{e.preventDefault();navigate(\'catalog\')}} aria-label="ESAN Emprende, inicio"');return {contents:source,loader:'tsx',resolveDir:path.dirname(args.path)}});
 }}]
});
let fonts='';
for(const family of ['manrope','dm-sans'])for(const weight of [400,500,600,700,800]){
 if((family==='manrope'&&weight===500)||(family==='dm-sans'&&weight===800))continue;
 const dir=path.join(root,'node_modules/@fontsource',family);
 let css=await readFile(path.join(dir,`latin-${weight}.css`),'utf8');
 const file=/url\(\.\/(files\/[^)]+\.woff2)\)/.exec(css)[1];
 const data=(await readFile(path.join(dir,file))).toString('base64');
 css=css.replace(/src:[\s\S]*?;/,`src:url(data:font/woff2;base64,${data}) format('woff2');`);
 fonts+=css;
}
const css=(await readFile(path.join(root,'src/app/globals.css'),'utf8'))+'\n'+(await readFile(path.join(root,'src/app/editorial.css'),'utf8'));
const script=bundled.outputFiles[0].text.replaceAll('</script','<\\/script');
const html=`<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="ESAN Emprende: demostración local sin conexión."><title>ESAN Emprende · Demo local</title><style>${fonts}\n${css}</style></head><body><div id="app"></div><noscript>Activa JavaScript para explorar esta demostración local.</noscript><script>${script}</script></body></html>`;
await writeFile(output,html);console.log(JSON.stringify({output,bytes:Buffer.byteLength(html)}));
