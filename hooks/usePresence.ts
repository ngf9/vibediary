'use client';

import { db } from '@/lib/instant';

export function usePresence() {
  // Create a room for site-wide presence
  const room = db.room('sitePresence', 'global');

  // Use the presence hook with initial data
  const { user, peers, publishPresence, isLoading, error } = db.rooms.usePresence(room, {
    initialData: {
      joinedAt: Date.now(),
      name: 'Anonymous Visitor',
    }
  });

  // Calculate total visitors (self + peers)
  const visitorCount = 1 + Object.keys(peers || {}).length;

  return {
    visitorCount,
    isLoading,
    error,
    peers,
    publishPresence,
  };
}