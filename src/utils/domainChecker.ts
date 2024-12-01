import { DomainResult } from '../types';

export async function checkDomain(domain: string): Promise<DomainResult> {
  try {
    const cleanDomain = domain.trim().toLowerCase();
    if (!isValidDomain(cleanDomain)) {
      throw new Error('Invalid domain format');
    }

    const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}`);
    const data = await response.json();
    
    // If Status is NXDOMAIN (3), domain might be available
    const isAvailable = data.Status === 3;

    return {
      domain: cleanDomain,
      isAvailable,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      domain,
      isAvailable: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      checkedAt: new Date(),
    };
  }
}

export function isValidDomain(domain: string): boolean {
  const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain);
}

export async function processDomainBatch(
  domains: string[],
  batchSize: number = 10,
  onProgress: (results: DomainResult[]) => void
): Promise<void> {
  const results: DomainResult[] = [];
  
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(domain => checkDomain(domain))
    );
    
    results.push(...batchResults);
    onProgress(batchResults);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}