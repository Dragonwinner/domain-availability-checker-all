export interface DomainResult {
  domain: string;
  isAvailable: boolean | null;
  error?: string;
  checkedAt: Date;
}

export interface DomainCheckStats {
  total: number;
  checked: number;
  available: number;
  unavailable: number;
  errors: number;
}

export type SortField = 'domain' | 'status' | 'checkedAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  status: 'all' | 'available' | 'unavailable' | 'error';
  search: string;
}