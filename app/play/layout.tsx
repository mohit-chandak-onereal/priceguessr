import { MainLayout } from '@/components/layout/main-layout';
import { ReactNode } from 'react';

export default function PlayLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}