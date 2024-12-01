import React from 'react';
import { Download } from 'lucide-react';
import { DomainResult } from '../types';

interface ExportOptionsProps {
  results: DomainResult[];
}

export function ExportOptions({ results }: ExportOptionsProps) {
  const exportDomains = (type: 'available' | 'unavailable') => {
    const filteredDomains = results
      .filter(r => type === 'available' ? r.isAvailable === true : r.isAvailable === false)
      .map(r => r.domain)
      .join('\n');

    const blob = new Blob([filteredDomains], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-domains.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportDomains('available')}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <Download size={20} />
        Export Available
      </button>
      <button
        onClick={() => exportDomains('unavailable')}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <Download size={20} />
        Export Unavailable
      </button>
    </div>
  );
}