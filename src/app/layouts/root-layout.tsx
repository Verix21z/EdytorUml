import { Outlet } from 'react-router';
import { SidebarNav } from '../components/sidebar-nav';

export function RootLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
