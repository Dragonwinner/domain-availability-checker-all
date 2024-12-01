import React, { useState, useCallback, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { DomainInput } from './components/DomainInput';
import { ResultsTable } from './components/ResultsTable';
import { Stats } from './components/Stats';
import { ExportOptions } from './components/ExportOptions';
import { processDomainBatch } from './utils/domainChecker';
import { DomainResult, FilterOptions, SortField, SortOrder } from './types';

function App() {
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    search: '',
  });
  const [sortField, setSortField] = useState<SortField>('domain');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleDomainsSubmit = useCallback(async (domains: string[]) => {
    setIsProcessing(true);
    setResults([]);

    await processDomainBatch(
      domains,
      10,
      (batchResults) => {
        setResults(prev => [...prev, ...batchResults]);
      }
    );

    setIsProcessing(false);
  }, []);

  const stats = useMemo(() => ({
    total: results.length,
    checked: results.length,
    available: results.filter(r => r.isAvailable === true).length,
    unavailable: results.filter(r => r.isAvailable === false).length,
    errors: results.filter(r => r.isAvailable === null).length,
  }), [results]);

  const handleSort = useCallback((field: SortField) => {
    setSortOrder(current => 
      sortField === field && current === 'asc' ? 'desc' : 'asc'
    );
    setSortField(field);
  }, [sortField]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Domain Availability Checker
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Domains</h2>
            <FileUpload onDomainsLoaded={handleDomainsSubmit} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter Domains</h2>
            <DomainInput onSubmit={handleDomainsSubmit} />
          </div>
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Processing domains...</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="mb-8">
              <Stats stats={stats} />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                  <select
                    className="rounded-lg border p-2"
                    value={filters.status}
                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value as FilterOptions['status'] }))}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="error">Errors</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search domains..."
                    className="rounded-lg border p-2"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  />
                </div>
                <ExportOptions results={results} />
              </div>

              <ResultsTable
                results={results}
                filters={filters}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;