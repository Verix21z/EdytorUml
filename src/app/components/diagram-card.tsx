import { Clock, MoreVertical } from 'lucide-react';
import { Diagram } from '../data/mock-diagrams';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale'; // Import polskiego tłumaczenia daty

interface DiagramCardProps {
  diagram: Diagram;
}

export function DiagramCard({ diagram }: DiagramCardProps) {
  // Dodano locale: pl, aby czas wyświetlał się jako np. "2 godziny temu"
  const timeAgo = formatDistanceToNow(diagram.lastEdited, { 
    addSuffix: true, 
    locale: pl 
  });

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 overflow-hidden relative">
        <img
          src={diagram.thumbnail}
          alt={diagram.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">{diagram.title}</h3>
          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{diagram.type}</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}