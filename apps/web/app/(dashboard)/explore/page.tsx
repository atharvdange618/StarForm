import type { Metadata } from 'next';
import ExploreClient from './explore-client';

export const metadata: Metadata = {
  title: 'Explore Public Forms',
  description: 'Explore and respond to beautiful public forms created by the StarForm community.',
};

export default function ExplorePage() {
  return <ExploreClient />;
}
