import { redirect } from 'next/navigation';
import Marketplace from '@/components/marketplace';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser } from '@/lib/auth-policy';
export const dynamic='force-dynamic';
export default async function Page(){
 const client=await supabaseServer();
 if(!client)redirect('/acceso');
 const {data:{user},error}=await client.auth.getUser();
 if(error||!allowedUser(user))redirect('/acceso');
 return <Marketplace accountId={user!.id}/>;
}
