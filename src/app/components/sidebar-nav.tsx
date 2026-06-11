import { Link, useLocation } from 'react-router';
import {
  Home, FileText, Share2, Settings, PenTool,
  Library, Eye, ChevronRight // Zmieniono ikonę na Eye
} from 'lucide-react';

const mainNav = [
  { icon: Home, label: 'Panel sterowania', path: '/' },
  { icon: FileText, label: 'Szablony', path: '/templates' },
  { icon: Share2, label: 'Udostępnione dla mnie', path: '/shared' },
];

const prefNav = [
  { icon: Library, label: 'Biblioteka kształtów', path: '/settings/shape-library' },
  { icon: Eye, label: 'Ułatwienia dostępu', path: '/settings/accessibility' }, // Nowa ikona i nazwa
  { icon: Settings, label: 'Ustawienia', path: '/settings' },
];

function NavItem({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <li>
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{label}</span>
        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
      </Link>
    </li>
  );
}

export function SidebarNav() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Edytor UML</span>
        </div>
      </div>

      {/* Przycisk CTA: Otwórz edytor */}
      <div className="px-4 pt-4">
        <Link
          to="/editor"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PenTool className="w-4 h-4" />
          Otwórz edytor
        </Link>
      </div>

      {/* Nawigacja */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Sekcja główna */}
        <div className="mb-4">
          <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Obszar roboczy</p>
          <ul className="space-y-0.5">
            {mainNav.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </ul>
        </div>

        {/* Sekcja preferencji */}
        <div>
          <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferencje</p>
          <ul className="space-y-0.5">
            {prefNav.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </ul>
        </div>
      </nav>

      {/* Informacje o użytkowniku */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">JK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Jan Kowalski</p>
            <p className="text-xs text-gray-500 truncate">jan.kowalski@przyklad.pl</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}