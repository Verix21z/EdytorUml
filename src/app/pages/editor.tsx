import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronLeft, Save, Download, Undo2, Redo2,
  ZoomIn, ZoomOut, MousePointer, User, Square,
  Circle, StickyNote, ArrowRight, PenTool, Check, Trash2, Plus, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ElementType = 'class' | 'interface' | 'actor' | 'note';

interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  name: string;
  color: string;
  opacity: number;
  attrs?: string[];
  methods?: string[];
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  style: 'solid' | 'dashed';
  multiplicity?: { from: string; to: string };
}

type HistoryEntry = { elements: CanvasElement[]; connections: Connection[] };

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#6366F1', '#EC4899', '#14B8A6',
  '#F97316', '#84CC16', '#6B7280', '#1E293B',
];

const CANVAS_W = 900;
const CANVAS_H = 520;

const tools = [
  { id: 'select',    label: 'Zaznacz',   Icon: MousePointer },
  { id: 'actor',     label: 'Aktor',     Icon: User },
  { id: 'class',     label: 'Klasa',     Icon: Square },
  { id: 'interface', label: 'Interfejs', Icon: Circle },
  { id: 'note',      label: 'Notatka',   Icon: StickyNote },
  { id: 'connect',   label: 'Połączenie', Icon: ArrowRight },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let idCounter = 100;
const genId = () => `el_${++idCounter}`;
const connId = () => `conn_${++idCounter}`;

function getElementBounds(el: CanvasElement): { cx: number; cy: number; w: number; h: number } {
  switch (el.type) {
    case 'class': {
      const W = 160;
      const HEADER_H = 30;
      const ATTR_H = (el.attrs?.length ?? 0) * 17 + 14;
      const METHOD_H = (el.methods?.length ?? 0) * 17 + 14;
      return { cx: el.x + W / 2, cy: el.y + (HEADER_H + ATTR_H + METHOD_H) / 2, w: W, h: HEADER_H + ATTR_H + METHOD_H };
    }
    case 'interface': {
      const W = 160;
      const HEADER_H = 44;
      const ATTR_H = (el.attrs?.length ?? 0) * 17 + 14;
      return { cx: el.x + W / 2, cy: el.y + (HEADER_H + ATTR_H) / 2, w: W, h: HEADER_H + ATTR_H };
    }
    case 'actor':
      return { cx: el.x + 20, cy: el.y + 40, w: 40, h: 90 };
    case 'note':
      return { cx: el.x + 77, cy: el.y + 40, w: 155, h: 80 };
    default:
      return { cx: el.x, cy: el.y, w: 40, h: 40 };
  }
}

function getAnchorPoint(el: CanvasElement, toward: { x: number; y: number }): { x: number; y: number } {
  const b = getElementBounds(el);
  const dx = toward.x - b.cx;
  const dy = toward.y - b.cy;
  const angle = Math.atan2(dy, dx);
  const hw = b.w / 2;
  const hh = b.h / 2;
  let ax: number, ay: number;
  if (Math.abs(dx * hh) > Math.abs(dy * hw)) {
    ax = b.cx + Math.sign(dx) * hw;
    ay = b.cy + Math.sign(dx) * hw * Math.tan(angle);
  } else {
    ay = b.cy + Math.sign(dy) * hh;
    ax = b.cx + Math.sign(dy) * hh / Math.tan(angle);
  }
  return { x: ax, y: ay };
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const initialElements: CanvasElement[] = [
  {
    id: 'user', type: 'class', x: 50, y: 55,
    name: 'Użytkownik', color: '#3B82F6', opacity: 100,
    attrs: ['- id: String', '- login: String', '- email: String'],
    methods: ['+ zaloguj(): void', '+ wyloguj(): void'],
  },
  {
    id: 'order', type: 'class', x: 330, y: 55,
    name: 'Zamówienie', color: '#8B5CF6', opacity: 100,
    attrs: ['- id: String', '- status: String', '- suma: Float'],
    methods: ['+ zloz(): void', '+ anuluj(): void'],
  },
  {
    id: 'product', type: 'class', x: 610, y: 55,
    name: 'Produkt', color: '#10B981', opacity: 100,
    attrs: ['- id: String', '- nazwa: String', '- cena: Float'],
    methods: ['+ pobierzSzczegoly(): Map'],
  },
  {
    id: 'ipayable', type: 'interface', x: 330, y: 300,
    name: 'IPlatne', color: '#F59E0B', opacity: 100,
    attrs: ['+ zaplac(): void', '+ zwrot(): void'],
    methods: [],
  },
  {
    id: 'customer', type: 'actor', x: 75, y: 310,
    name: 'Klient', color: '#6366F1', opacity: 100,
  },
  {
    id: 'note1', type: 'note', x: 610, y: 295,
    name: 'Produkty posiadają\npole SKU', color: '#6B7280', opacity: 80,
  },
];

const initialConnections: Connection[] = [
  { id: 'c1', fromId: 'user', toId: 'order', style: 'solid', multiplicity: { from: '1', to: '*' } },
  { id: 'c2', fromId: 'order', toId: 'product', style: 'solid', multiplicity: { from: '1', to: '*' } },
  { id: 'c3', fromId: 'order', toId: 'ipayable', style: 'dashed', label: 'implementuje' },
  { id: 'c4', fromId: 'customer', toId: 'order', style: 'dashed' },
];

// ─── Shape components ─────────────────────────────────────────────────────────

function ClassBoxShape({ el, isSelected, onPointerDown }: {
  el: CanvasElement; isSelected: boolean; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const W = 160;
  const HEADER_H = 30;
  const ATTR_H = (el.attrs?.length ?? 0) * 17 + 14;
  const METHOD_H = (el.methods?.length ?? 0) * 17 + 14;
  const TOTAL_H = HEADER_H + ATTR_H + METHOD_H;

  return (
    <g onPointerDown={onPointerDown} style={{ cursor: 'move', opacity: el.opacity / 100 }}>
      {isSelected && (
        <rect x={el.x - 4} y={el.y - 4} width={W + 8} height={TOTAL_H + 8}
          fill="none" stroke="#2563EB" strokeWidth="2" rx={6} strokeDasharray="5,3" />
      )}
      <rect x={el.x} y={el.y} width={W} height={HEADER_H} fill={el.color} rx={4} />
      <rect x={el.x} y={el.y + HEADER_H - 4} width={W} height={4} fill={el.color} />
      <text x={el.x + W / 2} y={el.y + 20} textAnchor="middle" fill="white" fontSize={12} fontWeight="600">{el.name}</text>
      <rect x={el.x} y={el.y + HEADER_H} width={W} height={ATTR_H} fill="white" stroke="#e5e7eb" strokeWidth="1" />
      {el.attrs?.map((a, i) => (
        <text key={i} x={el.x + 10} y={el.y + HEADER_H + 12 + i * 17} fill="#374151" fontSize={11} fontFamily="'Courier New', monospace">{a}</text>
      ))}
      <line x1={el.x} y1={el.y + HEADER_H + ATTR_H} x2={el.x + W} y2={el.y + HEADER_H + ATTR_H} stroke="#e5e7eb" strokeWidth="1" />
      <rect x={el.x} y={el.y + HEADER_H + ATTR_H} width={W} height={METHOD_H} fill="#fafafa" stroke="#e5e7eb" strokeWidth="1" />
      <rect x={el.x} y={el.y + HEADER_H + ATTR_H + METHOD_H - 4} width={W} height={4} fill="#fafafa" rx={2} />
      {el.methods?.map((m, i) => (
        <text key={i} x={el.x + 10} y={el.y + HEADER_H + ATTR_H + 12 + i * 17} fill="#6366F1" fontSize={11} fontFamily="'Courier New', monospace">{m}</text>
      ))}
    </g>
  );
}

function InterfaceShape({ el, isSelected, onPointerDown }: {
  el: CanvasElement; isSelected: boolean; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const W = 160;
  const HEADER_H = 44;
  const ATTR_H = (el.attrs?.length ?? 0) * 17 + 14;
  const TOTAL_H = HEADER_H + ATTR_H;

  return (
    <g onPointerDown={onPointerDown} style={{ cursor: 'move', opacity: el.opacity / 100 }}>
      {isSelected && (
        <rect x={el.x - 4} y={el.y - 4} width={W + 8} height={TOTAL_H + 8}
          fill="none" stroke="#2563EB" strokeWidth="2" rx={6} strokeDasharray="5,3" />
      )}
      <rect x={el.x} y={el.y} width={W} height={HEADER_H} fill={el.color} rx={4} />
      <rect x={el.x} y={el.y + HEADER_H - 4} width={W} height={4} fill={el.color} />
      <text x={el.x + W / 2} y={el.y + 15} textAnchor="middle" fill="white" fontSize={9} fontStyle="italic">«interface»</text>
      <text x={el.x + W / 2} y={el.y + 32} textAnchor="middle" fill="white" fontSize={12} fontWeight="600">{el.name}</text>
      <rect x={el.x} y={el.y + HEADER_H} width={W} height={ATTR_H} fill="white" stroke={el.color} strokeWidth="1" strokeDasharray="5,3" />
      {el.attrs?.map((a, i) => (
        <text key={i} x={el.x + 10} y={el.y + HEADER_H + 12 + i * 17} fill="#374151" fontSize={11} fontFamily="'Courier New', monospace">{a}</text>
      ))}
    </g>
  );
}

function ActorShape({ el, isSelected, onPointerDown }: {
  el: CanvasElement; isSelected: boolean; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const CX = el.x + 20;
  return (
    <g onPointerDown={onPointerDown} style={{ cursor: 'move', opacity: el.opacity / 100 }}>
      {isSelected && (
        <rect x={el.x - 4} y={el.y - 4} width={48} height={96}
          fill="none" stroke="#2563EB" strokeWidth="2" rx={6} strokeDasharray="5,3" />
      )}
      <circle cx={CX} cy={el.y + 12} r={11} fill="white" stroke={el.color} strokeWidth="2" />
      <line x1={CX} y1={el.y + 23} x2={CX} y2={el.y + 52} stroke={el.color} strokeWidth="2" />
      <line x1={CX - 15} y1={el.y + 37} x2={CX + 15} y2={el.y + 37} stroke={el.color} strokeWidth="2" />
      <line x1={CX} y1={el.y + 52} x2={CX - 13} y2={el.y + 72} stroke={el.color} strokeWidth="2" />
      <line x1={CX} y1={el.y + 52} x2={CX + 13} y2={el.y + 72} stroke={el.color} strokeWidth="2" />
      <text x={CX} y={el.y + 86} textAnchor="middle" fill="#374151" fontSize={11}>{el.name}</text>
    </g>
  );
}

function NoteShape({ el, isSelected, onPointerDown }: {
  el: CanvasElement; isSelected: boolean; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const W = 155;
  const H = 80;
  const FOLD = 16;
  const lines = el.name.split('\n');
  return (
    <g onPointerDown={onPointerDown} style={{ cursor: 'move', opacity: el.opacity / 100 }}>
      {isSelected && (
        <rect x={el.x - 4} y={el.y - 4} width={W + 8} height={H + 8}
          fill="none" stroke="#2563EB" strokeWidth="2" rx={6} strokeDasharray="5,3" />
      )}
      <path d={`M${el.x},${el.y} L${el.x + W - FOLD},${el.y} L${el.x + W},${el.y + FOLD} L${el.x + W},${el.y + H} L${el.x},${el.y + H} Z`}
        fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
      <path d={`M${el.x + W - FOLD},${el.y} L${el.x + W - FOLD},${el.y + FOLD} L${el.x + W},${el.y + FOLD}`}
        fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
      {lines.map((line, i) => (
        <text key={i} x={el.x + 10} y={el.y + 22 + i * 18} fill="#374151" fontSize={11}>{line}</text>
      ))}
    </g>
  );
}

function CanvasShape({ el, isSelected, onPointerDown }: {
  el: CanvasElement; isSelected: boolean; onPointerDown: (e: React.PointerEvent) => void;
}) {
  switch (el.type) {
    case 'class':     return <ClassBoxShape     el={el} isSelected={isSelected} onPointerDown={onPointerDown} />;
    case 'interface': return <InterfaceShape    el={el} isSelected={isSelected} onPointerDown={onPointerDown} />;
    case 'actor':     return <ActorShape        el={el} isSelected={isSelected} onPointerDown={onPointerDown} />;
    case 'note':      return <NoteShape         el={el} isSelected={isSelected} onPointerDown={onPointerDown} />;
    default:          return null;
  }
}

// ─── Connection SVG ───────────────────────────────────────────────────────────

function ConnectionLine({ conn, elements, isSelected, onClick }: {
  conn: Connection;
  elements: CanvasElement[];
  isSelected: boolean;
  onClick: () => void;
}) {
  const from = elements.find(e => e.id === conn.fromId);
  const to   = elements.find(e => e.id === conn.toId);
  if (!from || !to) return null;

  const bFrom = getElementBounds(from);
  const bTo   = getElementBounds(to);
  const ap1 = getAnchorPoint(from, bTo);
  const ap2 = getAnchorPoint(to,   bFrom);

  const mx = (ap1.x + ap2.x) / 2;
  const my = (ap1.y + ap2.y) / 2;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* invisible thick hit area */}
      <line x1={ap1.x} y1={ap1.y} x2={ap2.x} y2={ap2.y}
        stroke="transparent" strokeWidth={12} />
      <line
        x1={ap1.x} y1={ap1.y} x2={ap2.x} y2={ap2.y}
        stroke={isSelected ? '#2563EB' : '#94a3b8'}
        strokeWidth={isSelected ? 2 : 1.5}
        strokeDasharray={conn.style === 'dashed' ? '6,3' : undefined}
        markerEnd="url(#arrowhead)"
      />
      {conn.label && (
        <text x={mx} y={my - 6} textAnchor="middle" fontSize={10} fill="#64748b" fontStyle="italic">{conn.label}</text>
      )}
      {conn.multiplicity && (
        <>
          <text x={ap1.x + (ap2.x - ap1.x) * 0.12} y={ap1.y + (ap2.y - ap1.y) * 0.12 - 6}
            fontSize={10} fill="#64748b">{conn.multiplicity.from}</text>
          <text x={ap2.x - (ap2.x - ap1.x) * 0.12} y={ap2.y - (ap2.y - ap1.y) * 0.12 - 6}
            fontSize={10} fill="#64748b">{conn.multiplicity.to}</text>
        </>
      )}
    </g>
  );
}

// ─── List editor (attrs / methods) ───────────────────────────────────────────

function ListEditor({ label, items, onChange }: {
  label: string; items: string[]; onChange: (items: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...items]; next[i] = val; onChange(next);
  };
  const remove = (i: number) => { onChange(items.filter((_, idx) => idx !== i)); };
  const add    = ()           => { onChange([...items, '']); };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <button onClick={add}
          className="flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-800 transition-colors">
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              type="text" value={item}
              onChange={e => update(i, e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              placeholder="np. - id: String"
            />
            <button onClick={() => remove(i)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400 italic">Brak pozycji</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function EditorWorkspace() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [elements,     setElements]     = useState<CanvasElement[]>(initialElements);
  const [connections,  setConnections]  = useState<Connection[]>(initialConnections);
  const [selectedId,   setSelectedId]   = useState<string | null>('user');
  const [selectedConn, setSelectedConn] = useState<string | null>(null);
  const [activeTool,   setActiveTool]   = useState('select');
  const [zoom,         setZoom]         = useState(100);
  const [saved,        setSaved]        = useState(false);
  const [connectFrom,  setConnectFrom]  = useState<string | null>(null);
  const [mousePos,     setMousePos]     = useState<{ x: number; y: number } | null>(null);

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);

  // Drag state (ref to avoid re-renders during drag)
  const dragRef = useRef<{
    id: string; startX: number; startY: number; origX: number; origY: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // ── History helpers ────────────────────────────────────────────────────────
  const pushHistory = useCallback((els: CanvasElement[], conns: Connection[]) => {
    setUndoStack(prev => [...prev.slice(-49), { elements: els, connections: conns }]);
    setRedoStack([]);
  }, []);

  const undo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack(r => [...r, { elements, connections }]);
      setElements(last.elements);
      setConnections(last.connections);
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setUndoStack(u => [...u, { elements, connections }]);
      setElements(last.elements);
      setConnections(last.connections);
      return prev.slice(0, -1);
    });
  };

  // ── SVG coordinate helper ──────────────────────────────────────────────────
  const svgPoint = (e: React.PointerEvent | React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top)  / scale,
    };
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleElementPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();

    if (activeTool === 'connect') {
      // Connect mode: first click picks source, second picks target
      if (connectFrom === null) {
        setConnectFrom(id);
      } else if (connectFrom !== id) {
        pushHistory(elements, connections);
        const newConn: Connection = {
          id: connId(), fromId: connectFrom, toId: id, style: 'solid',
        };
        setConnections(prev => [...prev, newConn]);
        setConnectFrom(null);
        setSelectedConn(newConn.id);
        setSelectedId(null);
      }
      return;
    }

    if (activeTool !== 'select') return;

    setSelectedId(id);
    setSelectedConn(null);

    const pt = svgPoint(e);
    const el = elements.find(x => x.id === id)!;
    dragRef.current = { id, startX: pt.x, startY: pt.y, origX: el.x, origY: el.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handleSvgPointerMove = (e: React.PointerEvent) => {
    const pt = svgPoint(e);
    setMousePos(pt);

    if (!dragRef.current) return;
    const dx = pt.x - dragRef.current.startX;
    const dy = pt.y - dragRef.current.startY;
    const newX = Math.max(0, dragRef.current.origX + dx);
    const newY = Math.max(0, dragRef.current.origY + dy);
    setElements(prev => prev.map(el =>
      el.id === dragRef.current!.id ? { ...el, x: newX, y: newY } : el
    ));
  };

  const handleSvgPointerUp = () => {
    if (dragRef.current) {
      // Commit to history only if actually moved
      const el = elements.find(x => x.id === dragRef.current!.id);
      if (el && (el.x !== dragRef.current.origX || el.y !== dragRef.current.origY)) {
        setUndoStack(prev => [...prev.slice(-49), { elements: elements, connections }]);
        setRedoStack([]);
      }
      dragRef.current = null;
    }
  };

  // ── Canvas click — add new element ────────────────────────────────────────
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target !== svgRef.current) return;
    if (activeTool === 'select') { setSelectedId(null); setSelectedConn(null); return; }
    if (activeTool === 'connect') { setConnectFrom(null); return; }

    const pt = svgPoint(e);

    const newEl: CanvasElement = {
      id: genId(),
      type: activeTool as ElementType,
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      name: activeTool === 'class' ? 'NowaKlasa' :
            activeTool === 'interface' ? 'NowyInterfejs' :
            activeTool === 'actor' ? 'Aktor' : 'Notatka',
      color: '#3B82F6',
      opacity: 100,
      attrs:   activeTool === 'class' || activeTool === 'interface' ? [] : undefined,
      methods: activeTool === 'class' ? [] : undefined,
    };

    pushHistory(elements, connections);
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
    setActiveTool('select');
  };

  // ── Delete element or connection ───────────────────────────────────────────
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      pushHistory(elements, connections);
      setElements(prev => prev.filter(e => e.id !== selectedId));
      setConnections(prev => prev.filter(c => c.fromId !== selectedId && c.toId !== selectedId));
      setSelectedId(null);
    } else if (selectedConn) {
      pushHistory(elements, connections);
      setConnections(prev => prev.filter(c => c.id !== selectedConn));
      setSelectedConn(null);
    }
  }, [selectedId, selectedConn, elements, connections, pushHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelected]);

  // ── Element update helper ──────────────────────────────────────────────────
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const commitElementUpdate = () => {
    setUndoStack(prev => [...prev.slice(-49), { elements, connections }]);
    setRedoStack([]);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Persist to localStorage as JSON
    try {
      localStorage.setItem('uml_diagram', JSON.stringify({ elements, connections }));
    } catch {}
  };

  // ── Export SVG ────────────────────────────────────────────────────────────
  const handleExport = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    // Add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    link.click();
  };

  // ── Load from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('uml_diagram');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.elements) setElements(data.elements);
        if (data.connections) setConnections(data.connections);
      }
    } catch {}
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedEl   = elements.find(e => e.id === selectedId) ?? null;
  const selectedConnObj = connections.find(c => c.id === selectedConn) ?? null;

  // In-progress connection endpoint for drawing preview line
  const connectFromEl = connectFrom ? elements.find(e => e.id === connectFrom) : null;
  const connectFromBounds = connectFromEl ? getElementBounds(connectFromEl) : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Top toolbar ── */}
      <header className="flex items-center gap-1 bg-white border-b border-gray-200 px-3 py-2 z-10 flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors mr-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Panel sterowania</span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <PenTool className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">System E-Commerce</span>
          <span className="text-xs text-gray-400 ml-1">· Diagram klas</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
              saved
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Zapisano!' : 'Zapisz'}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors border border-blue-600"
          >
            <Download className="w-4 h-4" />
            Eksportuj SVG
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button
            onClick={undo} disabled={undoStack.length === 0}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
            title="Cofnij (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo} disabled={redoStack.length === 0}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
            title="Ponów (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button
            onClick={() => setZoom(z => Math.max(25, z - 25))}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition-colors"
            title="Pomniejsz"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="px-2 py-1 min-w-[52px] text-center bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 tabular-nums">
            {zoom}%
          </div>
          <button
            onClick={() => setZoom(z => Math.min(200, z + 25))}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition-colors"
            title="Powiększ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {(selectedId || selectedConn) && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                title="Usuń (Delete)"
              >
                <Trash2 className="w-4 h-4" />
                Usuń
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left toolbox ── */}
        <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-1 flex-shrink-0">
          {tools.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTool(id); if (id !== 'connect') setConnectFrom(null); }}
              title={label}
              className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-colors gap-0.5 ${
                activeTool === id
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] leading-none text-center">{label}</span>
            </button>
          ))}
        </aside>

        {/* ── Canvas area ── */}
        <main className="flex-1 overflow-auto bg-gray-100 flex items-start justify-start p-6">
          {/* Connect-mode hint banner */}
          {activeTool === 'connect' && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-blue-600 text-white text-xs rounded-full shadow-lg pointer-events-none">
              {connectFrom
                ? 'Kliknij drugi element aby zakończyć połączenie'
                : 'Kliknij element startowy połączenia'}
            </div>
          )}

          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', transition: 'transform 0.15s' }}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <svg
                ref={svgRef}
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  cursor: activeTool === 'connect'
                    ? 'crosshair'
                    : activeTool !== 'select' ? 'crosshair' : 'default'
                }}
                onClick={handleCanvasClick}
                onPointerMove={handleSvgPointerMove}
                onPointerUp={handleSvgPointerUp}
              >
                <defs>
                  <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="12" cy="12" r="0.8" fill="#d1d5db" />
                  </pattern>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                  </marker>
                </defs>
                <rect width={CANVAS_W} height={CANVAS_H} fill="url(#dotgrid)" />

                {/* Connections */}
                {connections.map(conn => (
                  <ConnectionLine
                    key={conn.id}
                    conn={conn}
                    elements={elements}
                    isSelected={selectedConn === conn.id}
                    onClick={() => { setSelectedConn(conn.id); setSelectedId(null); }}
                  />
                ))}

                {/* In-progress connection preview */}
                {activeTool === 'connect' && connectFrom && connectFromBounds && mousePos && (
                  <line
                    x1={connectFromBounds.cx} y1={connectFromBounds.cy}
                    x2={mousePos.x} y2={mousePos.y}
                    stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5,3"
                    pointerEvents="none"
                  />
                )}

                {/* Elements */}
                {elements.map(el => (
                  <CanvasShape
                    key={el.id}
                    el={el}
                    isSelected={selectedId === el.id || connectFrom === el.id}
                    onPointerDown={e => handleElementPointerDown(e, el.id)}
                  />
                ))}
              </svg>
            </div>
          </div>
        </main>

        {/* ── Right properties panel ── */}
        <aside className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Właściwości</h2>
          </div>

          {/* ── Element properties ── */}
          {selectedEl ? (
            <div className="p-4 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                  {selectedEl.type === 'class' ? 'Klasa' : selectedEl.type === 'interface' ? 'Interfejs' : selectedEl.type === 'actor' ? 'Aktor' : 'Notatka'}
                </span>
                <span className="text-xs text-gray-400">ID: {selectedEl.id}</span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {selectedEl.type === 'note' ? 'Treść notatki' : 'Nazwa elementu'}
                </label>
                {selectedEl.type === 'note' ? (
                  <textarea
                    value={selectedEl.name}
                    rows={3}
                    onChange={e => updateElement(selectedEl.id, { name: e.target.value })}
                    onBlur={commitElementUpdate}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Treść notatki"
                  />
                ) : (
                  <input
                    type="text"
                    value={selectedEl.name}
                    onChange={e => updateElement(selectedEl.id, { name: e.target.value })}
                    onBlur={commitElementUpdate}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nazwa elementu"
                  />
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Kolor</label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => { updateElement(selectedEl.id, { color }); commitElementUpdate(); }}
                      className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                        selectedEl.color === color ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: selectedEl.color }} />
                  <span className="text-xs text-gray-500 font-mono">{selectedEl.color.toUpperCase()}</span>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Przezroczystość</label>
                  <span className="text-xs text-gray-500 tabular-nums">{selectedEl.opacity}%</span>
                </div>
                <input
                  type="range" min={10} max={100} value={selectedEl.opacity}
                  onChange={e => updateElement(selectedEl.id, { opacity: Number(e.target.value) })}
                  onMouseUp={commitElementUpdate}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>10%</span><span>100%</span>
                </div>
              </div>

              {/* Position (editable) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Pozycja</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">X</span>
                    <input
                      type="number"
                      value={Math.round(selectedEl.x)}
                      onChange={e => updateElement(selectedEl.id, { x: Number(e.target.value) })}
                      onBlur={commitElementUpdate}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 tabular-nums focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Y</span>
                    <input
                      type="number"
                      value={Math.round(selectedEl.y)}
                      onChange={e => updateElement(selectedEl.id, { y: Number(e.target.value) })}
                      onBlur={commitElementUpdate}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 tabular-nums focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Attributes list */}
              {selectedEl.attrs !== undefined && (
                <ListEditor
                  label={selectedEl.type === 'interface' ? 'Operacje interfejsu' : 'Atrybuty'}
                  items={selectedEl.attrs}
                  onChange={items => { updateElement(selectedEl.id, { attrs: items }); commitElementUpdate(); }}
                />
              )}

              {/* Methods list */}
              {selectedEl.methods !== undefined && selectedEl.type === 'class' && (
                <ListEditor
                  label="Metody"
                  items={selectedEl.methods}
                  onChange={items => { updateElement(selectedEl.id, { methods: items }); commitElementUpdate(); }}
                />
              )}

              {/* Delete button */}
              <button
                onClick={deleteSelected}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors mt-2"
              >
                <Trash2 className="w-4 h-4" />
                Usuń element
              </button>
            </div>

          /* ── Connection properties ── */
          ) : selectedConnObj ? (
            <div className="p-4 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  Połączenie
                </span>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Etykieta</label>
                <input
                  type="text"
                  value={selectedConnObj.label ?? ''}
                  onChange={e => setConnections(prev => prev.map(c =>
                    c.id === selectedConnObj.id ? { ...c, label: e.target.value } : c
                  ))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. implementuje"
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Styl linii</label>
                <div className="flex gap-2">
                  {(['solid', 'dashed'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => setConnections(prev => prev.map(c =>
                        c.id === selectedConnObj.id ? { ...c, style } : c
                      ))}
                      className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                        selectedConnObj.style === style
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {style === 'solid' ? 'Ciągła' : 'Przerywana'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiplicity */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Krotność</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400">Od</span>
                    <input
                      type="text"
                      value={selectedConnObj.multiplicity?.from ?? ''}
                      onChange={e => setConnections(prev => prev.map(c =>
                        c.id === selectedConnObj.id
                          ? { ...c, multiplicity: { from: e.target.value, to: c.multiplicity?.to ?? '' } }
                          : c
                      ))}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Do</span>
                    <input
                      type="text"
                      value={selectedConnObj.multiplicity?.to ?? ''}
                      onChange={e => setConnections(prev => prev.map(c =>
                        c.id === selectedConnObj.id
                          ? { ...c, multiplicity: { from: c.multiplicity?.from ?? '', to: e.target.value } }
                          : c
                      ))}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="*"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={deleteSelected}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Usuń połączenie
              </button>
            </div>

          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <MousePointer className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Nic nie zaznaczono</p>
              <p className="text-xs text-gray-400 mb-5">Kliknij element lub połączenie, aby edytować właściwości.</p>

              <div className="w-full border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Skróty klawiszowe</p>
                <div className="flex flex-col gap-1 text-xs text-gray-400">
                  <span><kbd className="font-mono bg-gray-100 px-1 rounded">Del</kbd> — usuń zaznaczenie</span>
                  <span><kbd className="font-mono bg-gray-100 px-1 rounded">Ctrl+Z</kbd> — cofnij</span>
                  <span><kbd className="font-mono bg-gray-100 px-1 rounded">Ctrl+Y</kbd> — ponów</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Status bar ── */}
      <footer className="flex items-center gap-4 px-4 py-1.5 bg-white border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
        <span>
          Narzędzie: <span className="font-medium text-gray-700 capitalize">
            {tools.find(t => t.id === activeTool)?.label ?? activeTool}
          </span>
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span>{elements.length} elementów</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>{connections.length} połączeń</span>
        <span className="w-px h-3 bg-gray-200" />
        {selectedEl  && <span>Wybrano: <span className="font-medium text-gray-700">{selectedEl.name.split('\n')[0]}</span></span>}
        {selectedConnObj && <span>Wybrano: <span className="font-medium text-gray-700">połączenie</span></span>}
        {!selectedEl && !selectedConnObj && <span className="text-gray-400">Kliknij, aby zaznaczyć</span>}
        {connectFrom && <span className="text-blue-600 font-medium">Tryb połączeń aktywny</span>}
        <span className="flex-1" />
        <span>Diagram klas · Cofnij: {undoStack.length}</span>
      </footer>
    </div>
  );
}