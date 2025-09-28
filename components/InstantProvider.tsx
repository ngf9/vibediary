'use client';

import React from 'react';

export default function InstantProvider({ children }: { children: React.ReactNode }) {
  // The Instant DB provider is automatically handled by the init function
  // This component is here for future auth or additional configuration
  return <>{children}</>;
}