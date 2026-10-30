import type { Metadata } from 'next';
import Marketplace from '@/components/marketplace';
export const metadata: Metadata = { title: 'ESAN Emprende · Demo interactiva', robots: { index: false, follow: false } };
export default function DemoPage() {
 return <Marketplace accountId="demo-aea-v1" preview demoMode/>;
}
