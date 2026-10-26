import { AUTH_ENABLED } from '@/lib/project-phase';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser } from '@/lib/auth-policy';
export async function GET(request:NextRequest){
 if(!AUTH_ENABLED)return new NextResponse(null,{status:303,headers:{Location:'/'}});
 const code=request.nextUrl.searchParams.get('code');
 const client=await supabaseServer();
 if(!code||!client)return new NextResponse(null,{status:303,headers:{Location:'/acceso?error=expired','Cache-Control':'private, no-store'}});
 const {error}=await client.auth.exchangeCodeForSession(code);
 if(error)return new NextResponse(null,{status:303,headers:{Location:'/acceso?error=expired','Cache-Control':'private, no-store'}});
 const {data:{user}}=await client.auth.getUser();
 if(!allowedUser(user)){
   await client.auth.signOut({scope:'local'});
   return new NextResponse(null,{status:303,headers:{Location:'/acceso?error=domain','Cache-Control':'private, no-store'}});
 }
 const response=new NextResponse(null,{status:303,headers:{Location:'/'}});
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
