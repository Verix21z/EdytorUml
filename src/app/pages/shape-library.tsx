import { useState } from 'react';
import { Square, GitBranch, Workflow, Users, Check, ArrowLeftRight } from 'lucide-react';

interface Category {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  shapeCount: number;
  color: string;
  enabled: boolean;
}

const defaultCategories: Category[] = [
  {
    id: 'class',
    icon: Square,
    name: 'Diagramy klas',
    description: 'Strukturalne plany definiujące klasy, atrybuty i relacje w projektowaniu obiektowym.',
    shapeCount: 18,
    color: '#3B82F6',
    enabled: true,
  },
  {
    id: 'sequence',
    icon: ArrowLeftRight,
    name: 'Diagramy sekwencji',
    description: 'Uporządkowane w czasie przepływy interakcji między obiektami, aktorami i komponentami systemu.',
    shapeCount: 14,
    color: '#8B5CF6',
    enabled: true,
  },
  {
    id: 'state',
    icon: Workflow,
    name: 'Maszyna stanów',
    description: 'Reprezentuje stany i przejścia systemu w trakcie jego cyklu życia.',
    shapeCount: 11,
    color: '#F59E0B',
    enabled: false,
  },
  {
    id: 'usecase',
    icon: Users,
    name: 'Przypadki użycia',
    description: 'Przedstawia funkcjonalność systemu z perspektywy zewnętrznych aktorów i użytkowników.',
    shapeCount: 9,
    color: '#10B981',
    enabled: true,
  },
  {
    id: 'activity',
    icon: GitBranch,
    name: 'Diagramy aktywności',
    description: 'Modeluje przepływy pracy, procesy oraz kontrolę danych w systemie.',
    shapeCount: 16,
    color: '#6366F1',
    enabled: false,
  },
];

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  color?: string;
}

function Toggle({ checked, onChange, color = '#3B82F6' }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0`}
      style={{
        backgroundColor: checked ? color : '#E5E7EB',
        boxShadow: `0 0 0 0 transparent`,
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function ShapeLibrary() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [savedState, setSavedState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, enabled: !cat.enabled } : cat)
    );
    setSavedState('idle');
  };

  const handleSave = () => {
    setSavedState('saving');
    setTimeout(() => setSavedState('saved'), 800);
    setTimeout(() => setSavedState('idle'), 3000);
  };

  const enabledCount = categories.filter(c => c.enabled).length;
  const totalShapes = categories.filter(c => c.enabled).reduce((sum, c) => sum + c.shapeCount, 0);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Biblioteka kształtów</h1>
          <p className="text-gray-500 mt-1.5">
            Włącz lub wyłącz kategorie diagramów UML dostępne w przyborniku edytora.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>
              Aktywne: <span className="font-medium text-gray-800">{enabledCount}</span> z {categories.length} kategorii
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>
              Dostępne kształty: <span className="font-medium text-gray-800">{totalShapes}</span>
            </span>
          </div>
        </div>

        {/* Lista kategorii */}
        <div className="space-y-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={`group flex items-center gap-5 p-5 bg-white rounded-xl border transition-all duration-200 ${
                  category.enabled
                    ? 'border-gray-200 shadow-sm'
                    : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Ikona */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: category.enabled ? `${category.color}18` : '#F3F4F6',
                  }}
                >
                  <Icon
                    className="w-6 h-6 transition-colors"
                    style={{ color: category.enabled ? category.color : '#9CA3AF' }}
                  />
                </div>

                {/* Informacje */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      Kształty: {category.shapeCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{category.description}</p>
                </div>

                {/* Przełącznik */}
                <Toggle
                  checked={category.enabled}
                  onChange={() => toggleCategory(category.id)}
                  color={category.color}
                />
              </div>
            );
          })}
        </div>

        {/* Linia rozdzielająca */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Szybkie akcje */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setCategories(prev => prev.map(c => ({ ...c, enabled: true })))}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Włącz wszystkie
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={() => setCategories(prev => prev.map(c => ({ ...c, enabled: false })))}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Wyłącz wszystkie
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={() => setCategories(defaultCategories)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Przywróć domyślne
          </button>
        </div>

        {/* Zapisz zmiany */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={savedState === 'saving'}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium transition-all ${
              savedState === 'saved'
                ? 'bg-green-600 text-white shadow-md'
                : savedState === 'saving'
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
            }`}
          >
            {savedState === 'saved' && <Check className="w-4 h-4" />}
            {savedState === 'saving' && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {savedState === 'saved' ? 'Zmiany zapisane!' : savedState === 'saving' ? 'Zapisywanie…' : 'Zapisz zmiany'}
          </button>

          {savedState === 'saved' && (
            <span className="text-sm text-green-600">
              Preferencje biblioteki kształtów zostały zaktualizowane.
            </span>
          )}
          {savedState === 'idle' && (
            <span className="text-xs text-gray-400">
              Zmiany zostaną natychmiast zastosowane w edytorze
            </span>
          )}
        </div>
      </div>
    </div>
  );
}