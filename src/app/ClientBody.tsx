'use client';

import React from 'react';

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({children}: ClientBodyProps) {
  return (
      {children}
  );
}

