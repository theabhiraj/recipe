'use client';

import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

interface ClientBodyProps {
  children: React.ReactNode;
  geistSans: Geist;
  geistMono: Geist_Mono;
}

export function ClientBody({ children, geistSans, geistMono }: ClientBodyProps) {
  const bodyClass = `antialiased ${geistSans.variable} ${geistMono.variable}`;

  return (
    <body className={bodyClass}>
      {children}
    </body>
  );
}
