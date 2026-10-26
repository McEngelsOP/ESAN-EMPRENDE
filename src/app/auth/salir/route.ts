import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
export async function POST(request:NextRequest){
 if(request.headers.get('origin')!==`${request.nextUrl.protocol}//${request.headers.get('host')}`)return new NextResponse('Solicitud no permitida',{status:403});
 const client=await supabaseServer();
 if(client)await client.auth.signOut({scope:'local'});
 const response=new NextResponse(null,{status:303,headers:{Location:'/acceso'}});
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
