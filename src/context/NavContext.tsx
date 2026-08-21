import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PageKey } from '@/types';

interface NavState {
  page: PageKey;
  params: Record<string, string>;
  navigate: (page: PageKey, params?: Record<string, string>) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const NavContext = createContext<NavState | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [params, setParams] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (newPage: PageKey, newParams: Record<string, string> = {}) => {
    setPage(newPage);
    setParams(newParams);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <NavContext.Provider value={{ page, params, navigate, sidebarOpen, setSidebarOpen }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
