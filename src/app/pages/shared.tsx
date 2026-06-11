import { Share2 } from 'lucide-react';

export function Shared() {
  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Udostępnione dla mnie</h1>
        <p className="text-gray-600 mb-8">Diagrams that others have shared with you</p>
        
        <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No shared diagrams yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
