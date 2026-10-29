/** Local demo IDs, including previews without crypto.randomUUID. Not an auth token. */
export function localRecordId():string {
 if(typeof globalThis.crypto?.randomUUID==='function')return globalThis.crypto.randomUUID();
 const bytes=new Uint8Array(16);
 if(typeof globalThis.crypto?.getRandomValues==='function')globalThis.crypto.getRandomValues(bytes);
 else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);
 bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const h=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
 return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
