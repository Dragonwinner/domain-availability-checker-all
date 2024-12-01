import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploadProps {
  onDomainsLoaded: (domains: string[]) => void;
}

export function FileUpload({ onDomainsLoaded }: FileUploadProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const domains = results.data
          .flat()
          .filter(Boolean)
          .map(String);
        onDomainsLoaded(domains);
      },
      error: (error) => {
        console.error('Error parsing file:', error);
      },
    });
  }, [onDomainsLoaded]);

  return (
    <div className="w-full">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-sm">Upload CSV file</span>
        <input
          type="file"
          className="hidden"
          accept=".csv,.txt"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}