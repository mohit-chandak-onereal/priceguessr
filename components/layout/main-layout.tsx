import { ReactNode } from 'react';
import { Header } from './header';
import { ToastContainer } from '@/components/ui/toast';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}