import { AUTH_ENABLED } from '@/lib/project-phase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser, postAuthDestination } from '@/lib/auth-policy';
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
 const jar=await cookies();
 const next=postAuthDestination(jar.get('esan-auth-next')?.value);
 jar.delete('esan-auth-next');
 const response=new NextResponse(null,{status:303,headers:{Location:next}});
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
