import React, { useState } from 'react';

interface DomainInputProps {
  onSubmit: (domains: string[]) => void;
}

export function DomainInput({ onSubmit }: DomainInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domains = input
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);
    onSubmit(domains);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter domains (one per line)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Check Domains
      </button>
    </form>
  );
}