import { ExternalLink } from 'lucide-react';
export function SwiggyLink({ className = '' }: { className?: string }) {
  const url = import.meta.env.VITE_SWIGGY_LISTING_URL as string | undefined;
  if (!url || !/^https:\/\//i.test(url)) return null;
  return <a className={className} href={url} target="_blank" rel="noopener noreferrer">Order on Swiggy <ExternalLink size={15}/></a>;
}
