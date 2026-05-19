import { api } from '@/lib/trpc-server';

export default async function Home() {
  const health = await api.health.getHealth();
  return <div>{health.status}</div>;
}
