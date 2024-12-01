import React from 'react';
import { DomainResult, FilterOptions, SortField, SortOrder } from '../types';
import { Check, X, AlertCircle } from 'lucide-react';

interface ResultsTableProps {
  results: DomainResult[];
  filters: FilterOptions;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function ResultsTable({
  results,
  filters,
  sortField,
  sortOrder,
  onSort,
}: ResultsTableProps) {
  const filteredResults = results.filter((result) => {
    if (filters.search && !result.domain.includes(filters.search)) {
      return false;
    }
    
    switch (filters.status) {
      case 'available':
        return result.isAvailable === true;
      case 'unavailable':
        return result.isAvailable === false;
      case 'error':
        return result.isAvailable === null;
      default:
        return true;
    }
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'domain':
        return a.domain.localeCompare(b.domain) * modifier;
      case 'checkedAt':
        return (a.checkedAt.getTime() - b.checkedAt.getTime()) * modifier;
      default:
        return 0;
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 cursor-pointer" onClick={() => onSort('domain')}>
              Domain {sortField === 'domain' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => onSort('checkedAt')}>
              Checked At {sortField === 'checkedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result) => (
            <tr key={result.domain} className="border-t">
              <td className="px-6 py-4">{result.domain}</td>
              <td className="px-6 py-4">
                {result.isAvailable === true && <Check className="text-green-500" />}
                {result.isAvailable === false && <X className="text-red-500" />}
                {result.isAvailable === null && (
                  <div className="flex items-center text-yellow-500">
                    <AlertCircle className="mr-2" />
                    {result.error}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {result.checkedAt.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}