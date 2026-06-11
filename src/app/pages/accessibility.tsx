import { useState } from 'react';
import { Eye, Type, Keyboard, Check, Info } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  disabled?: boolean;
}
function Toggle({ checked, onChange, id, disabled }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed`}
      style={{ backgroundColor: checked ? '#2563EB' : '#D1D5DB' }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface SectionCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
}
function SectionCard({ icon: Icon, iconColor, iconBg, title, description, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 px-6 pt-6 pb-5 border-b border-gray-100">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-6">{children}</div>
    </div>
  );
}

export function Accessibility() {
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(true);
  const [skipNav, setSkipNav] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [savedState, setSavedState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSavedState('saving');
    setTimeout(() => setSavedState('saved'), 900);
    setTimeout(() => setSavedState('idle'), 3500);
  };

  const handleReset = () => {
    setHighContrast(false);
    setReduceMotion(false);
    setFontSize(14);
    setDyslexicFont(false);
    setKeyboardFocus(true);
    setSkipNav(false);
    setScreenReader(false);
    setSavedState('idle');
  };

  const fontSizeLabels: Record<number, string> = {
    12: 'Mała (12px)',
    13: 'Mała-średnia (13px)',
    14: 'Domyślna (14px)',
    15: 'Średnia (15px)',
    16: 'Duża (16px)',
    18: 'Bardzo duża (18px)',
    20: 'XXL (20px)',
    22: 'XXXL (22px)',
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Ułatwienia dostępu</h1>
              <p className="text-gray-500 mt-1.5 leading-relaxed">
                Dostosuj aplikację do swoich potrzeb. <br />
                Ustawienia są zgodne z wytycznymi WCAG 2.1 na poziomie AA.
              </p>
            </div>
          </div>

          {/* WCAG badge */}
          <div className="flex items-center gap-2 mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">W</span>
              </div>
              <span className="text-xs text-blue-700 font-medium">WCAG 2.1 Poziom AA</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Zgodne</span>
            </div>
          </div>
        </div>

        <div className="space-y-5 mb-8">

          {/* ── Dostosowanie wizualne ── */}
          <SectionCard
            icon={Eye}
            iconColor="#3B82F6"
            iconBg="#EFF6FF"
            title="Dostosowanie wizualne"
            description="Dostosuj kolory i ruch, aby zmniejszyć zmęczenie wzroku i poprawić czytelność."
          >
            {/* Tryb wysokiego kontrastu */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="high-contrast" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  Tryb wysokiego kontrastu
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Zwiększa współczynnik kontrastu kolorów w całym interfejsie do minimum 7:1 (WCAG AAA).
                </p>
                {highContrast && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-700">Aktywne — kontrast: 7.2:1</span>
                  </div>
                )}
              </div>
              <Toggle id="high-contrast" checked={highContrast} onChange={setHighContrast} />
            </div>

            {/* Redukcja ruchu */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="reduce-motion" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  Redukcja ruchu
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Minimalizuje lub eliminuje animacje i przejścia, aby zapobiec dyskomfortowi u osób wrażliwych na ruch.
                </p>
              </div>
              <Toggle id="reduce-motion" checked={reduceMotion} onChange={setReduceMotion} />
            </div>
          </SectionCard>

          {/* ── Typografia ── */}
          <SectionCard
            icon={Type}
            iconColor="#8B5CF6"
            iconBg="#F5F3FF"
            title="Typografia"
            description="Dostosuj rozmiar i rodzaj czcionki dla większego komfortu czytania."
          >
            {/* Rozmiar czcionki */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="font-size-slider" className="block text-sm font-medium text-gray-900">
                  Rozmiar czcionki interfejsu
                </label>
                <span className="text-sm text-blue-600 font-medium tabular-nums">
                  {fontSizeLabels[fontSize] ?? `${fontSize}px`}
                </span>
              </div>
              <div className="relative">
                <input
                  id="font-size-slider"
                  type="range"
                  min={12}
                  max={22}
                  step={1}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                  aria-label="Rozmiar czcionki"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 px-0.5">
                  <span>Aa 12</span>
                  <span>Aa 14</span>
                  <span>Aa 16</span>
                  <span>Aa 18</span>
                  <span>Aa 22</span>
                </div>
              </div>

              {/* Podgląd na żywo */}
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Podgląd:</p>
                <p style={{ fontSize: `${fontSize}px` }} className="text-gray-800 leading-snug">
                  Podglad podglad 
                </p>
              </div>
            </div>

            {/* Czcionka dla dyslektyków */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="dyslexic-font" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  Czcionka dla dyslektyków
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Zmienia krój pisma na OpenDyslexic, co ułatwia rozpoznawanie liter.
                </p>
              </div>
              <Toggle id="dyslexic-font" checked={dyslexicFont} onChange={setDyslexicFont} />
            </div>
          </SectionCard>

          {/* ── Nawigacja ── */}
          <SectionCard
            icon={Keyboard}
            iconColor="#10B981"
            iconBg="#ECFDF5"
            title="Nawigacja"
            description="Popraw nawigację za pomocą klawiatury i technologii wspomagających."
          >
            {/* Wskaźnik fokusu klawiatury */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keyboardFocus}
                    onChange={(e) => setKeyboardFocus(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  Wyraźny wskaźnik fokusu klawiatury
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6 leading-relaxed">
                  Wyświetla grubą ramkę o wysokiej widoczności wokół aktywnych elementów podczas nawigacji klawiaturą (WCAG 2.4.11).
                </p>
                {keyboardFocus && (
                  <div className="ml-6 mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-700">Ramka: 3px solid #2563EB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pomiń nawigację */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipNav}
                    onChange={(e) => setSkipNav(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  Pokaż link "Przejdź do treści"
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6 leading-relaxed">
                  Wyświetla widoczny link na górze strony dla użytkowników klawiatury, umożliwiając ominięcie menu (WCAG 2.4.1).
                </p>
              </div>
            </div>

            {/* Optymalizacja czytnika ekranu */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="screen-reader" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  Optymalizacja czytnika ekranu
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Dodaje etykiety ARIA i regiony "live", aby poprawić kompatybilność z programami takimi jak NVDA czy VoiceOver.
                </p>
              </div>
              <Toggle id="screen-reader" checked={screenReader} onChange={setScreenReader} />
            </div>
          </SectionCard>

          {/* Notatka informacyjna */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Uwaga:</span> Niektóre ustawienia (np. wysoki kontrast) mogą nadpisać kolory motywu diagramów. Zmiany te dotyczą tylko interfejsu aplikacji, a nie eksportowanych plików.
              </p>
            </div>
          </div>
        </div>

        {/* Zapis / Reset */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={savedState === 'saving'}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium transition-all ${
              savedState === 'saved'
                ? 'bg-green-600 text-white'
                : savedState === 'saving'
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {savedState === 'saved' && <Check className="w-4 h-4" />}
            {savedState === 'saving' && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {savedState === 'saved' ? 'Preferencje zapisane!' : savedState === 'saving' ? 'Zapisywanie…' : 'Zapisz preferencje'}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Przywróć domyślne
          </button>

          {savedState === 'saved' && (
            <span className="text-sm text-green-600">Ustawienia zostały zastosowane.</span>
          )}
        </div>
      </div>
    </div>
  );
}