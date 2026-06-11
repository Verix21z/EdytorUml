import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, Download, Copy, Check, ExternalLink, PenTool } from 'lucide-react';

const FILE_FORMATS = ['PNG', 'SVG', 'PDF', 'JPEG'];

function DiagramPreviewSVG({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={460 * scale}
      height={340 * scale}
      viewBox="0 0 460 340"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="exp-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.7" fill="#d1d5db" />
        </pattern>
        <marker id="exp-arrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#94a3b8" />
        </marker>
      </defs>
      <rect width="460" height="340" fill="url(#exp-dots)" />

      {/* Połączenia */}
      <line x1="130" y1="85" x2="188" y2="85" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#exp-arrow)" />
      <line x1="278" y1="85" x2="338" y2="85" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#exp-arrow)" />
      <line x1="233" y1="138" x2="233" y2="200" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#exp-arrow)" />

      {/* Klasa Użytkownik */}
      <rect x="20" y="50" width="110" height="25" fill="#3B82F6" rx="3" />
      <rect x="20" y="72" width="110" height="3" fill="#3B82F6" />
      <text x="75" y="67" textAnchor="middle" fill="white" fontSize={9.5} fontWeight="600">Użytkownik</text>
      <rect x="20" y="75" width="110" height="65" fill="white" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="29" y="90" fill="#374151" fontSize={8} fontFamily="monospace">- id: String</text>
      <text x="29" y="104" fill="#374151" fontSize={8} fontFamily="monospace">- login: String</text>
      <text x="29" y="118" fill="#374151" fontSize={8} fontFamily="monospace">- email: String</text>
      <line x1="20" y1="123" x2="130" y2="123" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="29" y="135" fill="#6366F1" fontSize={8} fontFamily="monospace">+ zaloguj(): void</text>

      {/* Klasa Zamówienie */}
      <rect x="188" y="50" width="110" height="25" fill="#8B5CF6" rx="3" />
      <rect x="188" y="72" width="110" height="3" fill="#8B5CF6" />
      <text x="243" y="67" textAnchor="middle" fill="white" fontSize={9.5} fontWeight="600">Zamówienie</text>
      <rect x="188" y="75" width="110" height="65" fill="white" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="197" y="90" fill="#374151" fontSize={8} fontFamily="monospace">- id: String</text>
      <text x="197" y="104" fill="#374151" fontSize={8} fontFamily="monospace">- status: String</text>
      <text x="197" y="118" fill="#374151" fontSize={8} fontFamily="monospace">- suma: Float</text>
      <line x1="188" y1="123" x2="298" y2="123" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="197" y="135" fill="#6366F1" fontSize={8} fontFamily="monospace">+ zloz(): void</text>

      {/* Klasa Produkt */}
      <rect x="338" y="50" width="110" height="25" fill="#10B981" rx="3" />
      <rect x="338" y="72" width="110" height="3" fill="#10B981" />
      <text x="393" y="67" textAnchor="middle" fill="white" fontSize={9.5} fontWeight="600">Produkt</text>
      <rect x="338" y="75" width="110" height="65" fill="white" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="347" y="90" fill="#374151" fontSize={8} fontFamily="monospace">- id: String</text>
      <text x="347" y="104" fill="#374151" fontSize={8} fontFamily="monospace">- nazwa: String</text>
      <text x="347" y="118" fill="#374151" fontSize={8} fontFamily="monospace">- cena: Float</text>
      <line x1="338" y1="123" x2="448" y2="123" stroke="#e5e7eb" strokeWidth="0.8" />
      <text x="347" y="135" fill="#6366F1" fontSize={8} fontFamily="monospace">+ pobierzOpis(): Map</text>

      {/* Interfejs IPlatne */}
      <rect x="178" y="200" width="110" height="38" fill="#F59E0B" rx="3" />
      <rect x="178" y="224" width="110" height="3" fill="#F59E0B" />
      <text x="233" y="213" textAnchor="middle" fill="white" fontSize={7.5} fontStyle="italic">«interface»</text>
      <text x="233" y="225" textAnchor="middle" fill="white" fontSize={9.5} fontWeight="600">IPlatne</text>
      <rect x="178" y="238" width="110" height="35" fill="white" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,2" />
      <text x="187" y="252" fill="#374151" fontSize={8} fontFamily="monospace">+ zaplac(): void</text>
      <text x="187" y="265" fill="#374151" fontSize={8} fontFamily="monospace">+ zwrot(): void</text>

      {/* Notatka */}
      <path d="M340,205 L425,205 L440,220 L440,280 L340,280 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.8" />
      <path d="M425,205 L425,220 L440,220" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
      <text x="350" y="222" fill="#374151" fontSize={8}>Produkty posiadają</text>
      <text x="350" y="236" fill="#374151" fontSize={8}>pole SKU</text>

      {/* Etykiety liczności */}
      <text x="140" y="80" fontSize={8} fill="#64748b">1</text>
      <text x="175" y="80" fontSize={8} fill="#64748b">*</text>
      <text x="290" y="80" fontSize={8} fill="#64748b">1</text>
      <text x="325" y="80" fontSize={8} fill="#64748b">*</text>
      <text x="238" y="172" fontSize={8} fill="#64748b" fontStyle="italic">impl</text>
    </svg>
  );
}

export function ExportShare() {
  const [format, setFormat] = useState('PNG');
  const [scale, setScale] = useState(2);
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://uml-editor.app/share/diagram/e6f23a7b91c';

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = () => {
    // Symulacja akcji eksportu
    const size = format === 'PDF' ? '2.1 MB' : format === 'SVG' ? '48 KB' : `${scale * 780}×${scale * 420}px`;
    alert(`Eksportowanie jako ${format} (${size})…\n\nTo jest wersja demonstracyjna — plik nie został wygenerowany.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Górny pasek */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 z-10">
        <Link
          to="/editor"
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Powrót do edytora</span>
        </Link>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">Eksport i udostępnianie</span>
        </div>
      </header>

      {/* Główna treść */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Lewo: Podgląd diagramu ── */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Podgląd diagramu</h2>
              <p className="text-xs text-gray-500 mt-0.5">Architektura Systemu E-Commerce · Diagram klas</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Tryb podglądu</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded font-medium text-gray-600">{format}</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-[length:24px_24px]">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-full overflow-auto">
              <DiagramPreviewSVG />
            </div>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500 bg-gray-50">
            <span>Rozmiar wyjściowy: <span className="font-medium text-gray-700">{scale === 1 ? '780×420px' : `${scale * 780}×${scale * 420}px`}</span></span>
            <span>·</span>
            <span>Format: <span className="font-medium text-gray-700">{format}</span></span>
            <span>·</span>
            <span>6 elementów</span>
          </div>
        </div>

        {/* ── Prawo: Panel ustawień ── */}
        <div className="w-96 bg-white flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Ustawienia eksportu</h1>
            <p className="text-sm text-gray-500 mt-1">Skonfiguruj sposób eksportu diagramu</p>
          </div>

          <div className="flex-1 px-6 py-5 flex flex-col gap-6">

            {/* Format pliku */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Format pliku</label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer pr-10"
                >
                  <option value="PNG">PNG (Raster, przezroczystość)</option>
                  <option value="SVG">SVG (Wektor, bezstratny)</option>
                  <option value="PDF">PDF (Gotowy do druku)</option>
                  <option value="JPEG">JPEG (Skompresowany raster)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {FILE_FORMATS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                      format === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Skala obrazu */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Skala obrazu
                {format === 'SVG' && <span className="ml-2 text-xs text-gray-400 font-normal">(nie dotyczy SVG)</span>}
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    max={4}
                    step={0.5}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    disabled={format === 'SVG'}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">×</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      disabled={format === 'SVG'}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
                        scale === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Wyjście: {format === 'SVG' ? 'Skalowalny wektor' : `${scale * 780} × ${scale * 420} px`}
              </p>
            </div>

            {/* Opcje dodatkowe */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-3">Opcje</label>
              <div className="space-y-3">
                {[
                  { label: 'Dołącz tło', desc: 'Eksportuj wraz z tłem obszaru roboczego', checked: true },
                  { label: 'Przezroczyste tło', desc: 'Dostępne tylko dla formatu PNG', checked: format === 'PNG' },
                  { label: 'Dołącz metadane', desc: 'Zawrzyj nazwę diagramu i sygnaturę czasową', checked: true },
                ].map(({ label, desc, checked }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-9 h-5 rounded-full relative cursor-pointer flex-shrink-0 mt-0.5 transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link do udostępniania */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-800 mb-1">Link do udostępniania</h3>
              <p className="text-xs text-gray-500 mb-3">Każdy z tym linkiem może przeglądać diagram (tylko odczyt)</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mr-2" />
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs text-gray-600 bg-transparent outline-none select-all font-mono"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Skopiowano!' : 'Kopiuj link'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Link jest aktywny · Nigdy nie wygasa
                </div>
                <button className="ml-auto text-xs text-red-500 hover:text-red-700">Cofnij dostęp</button>
              </div>
            </div>
          </div>

          {/* Przycisk eksportu */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Eksportuj jako {format}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Szacowany rozmiar: {format === 'SVG' ? '48 KB' : format === 'PDF' ? '2.1 MB' : scale <= 2 ? `${Math.round(scale * 380)} KB` : '1.4 MB'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}