import { AUTH_ENABLED, CLOUD_ENABLED } from '@/lib/project-phase';
import Marketplace from '@/components/marketplace';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser } from '@/lib/auth-policy';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!AUTH_ENABLED)return <Marketplace accountId="interface-preview" preview/>;
 try{
  const client=await supabaseServer();
  if(client){
   const {data:{user},error}=await client.auth.getUser();
   if(!error&&allowedUser(user))return <Marketplace accountId={user!.id} cloudEnabled={CLOUD_ENABLED}/>;
  }
 }catch{
  // The public catalogue remains available if Supabase Auth is temporarily unreachable.
 }
 return <Marketplace accountId="public-visitor" preview authRequired/>;
}
