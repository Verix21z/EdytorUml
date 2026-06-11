import { Link } from 'react-router';
import {
  Library, Accessibility, User, Bell, CreditCard,
  Shield, ChevronRight, Puzzle
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Narzędzia diagramów',
    items: [
      {
        icon: Library,
        iconColor: '#3B82F6',
        iconBg: '#EFF6FF',
        label: 'Biblioteka kształtów',
        description: 'Włącz lub wyłącz kategorie elementów UML dostępne w edytorze.',
        path: '/settings/shape-library',
        badge: '5 kategorii',
      },
      {
        icon: Puzzle,
        iconColor: '#8B5CF6',
        iconBg: '#F5F3FF',
        label: 'Wtyczki edytora',
        description: 'Zarządzaj integracjami zewnętrznymi i rozszerzeniami edytora.',
        path: null,
        badge: 'Wkrótce',
      },
    ],
  },
  {
    title: 'Dostępność i wyświetlanie',
    items: [
      {
        icon: Accessibility,
        iconColor: '#10B981',
        iconBg: '#ECFDF5',
        label: 'Ułatwienia dostępu',
        description: 'Konfiguruj wysoki kontrast, rozmiar czcionki, wskaźniki fokusu i ustawienia WCAG.',
        path: '/settings/accessibility',
        badge: 'WCAG 2.1',
      },
    ],
  },
  {
    title: 'Konto',
    items: [
      {
        icon: User,
        iconColor: '#F59E0B',
        iconBg: '#FFFBEB',
        label: 'Profil',
        description: 'Zaktualizuj swoje imię, adres e-mail i awatar.',
        path: null,
        badge: null,
      },
      {
        icon: Bell,
        iconColor: '#6366F1',
        iconBg: '#EEF2FF',
        label: 'Powiadomienia',
        description: 'Zarządzaj preferencjami powiadomień e-mail i wewnątrz aplikacji.',
        path: null,
        badge: null,
      },
      {
        icon: CreditCard,
        iconColor: '#EF4444',
        iconBg: '#FEF2F2',
        label: 'Rozliczenia i plan',
        description: 'Przeglądaj swój obecny plan i zarządzaj subskrypcjami.',
        path: null,
        badge: 'Pro',
      },
      {
        icon: Shield,
        iconColor: '#6B7280',
        iconBg: '#F9FAFB',
        label: 'Bezpieczeństwo',
        description: 'Zmień hasło i zarządzaj uwierzytelnianiem dwuskładnikowym.',
        path: null,
        badge: null,
      },
    ],
  },
];

export function Settings() {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Ustawienia</h1>
          <p className="text-gray-500 mt-1.5">Zarządzaj swoim kontem, preferencjami i obszarem roboczym.</p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                {section.title}
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.iconBg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                          {item.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </div>
                  );

                  if (item.path) {
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        {inner}
                      </Link>
                    );
                  }
                  return (
                    <div
                      key={item.label}
                      className="block opacity-60 cursor-not-allowed"
                      title="Dostępne wkrótce"
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400">
            Edytor UML v2.4.1 · <a href="#" className="hover:text-gray-600">Prywatność</a> · <a href="#" className="hover:text-gray-600">Regulamin</a>
          </p>
        </div>
      </div>
    </div>
  );
}