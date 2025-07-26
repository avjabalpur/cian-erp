
export type FilterType = 'string' | 'number' | 'boolean' | 'date' | 'unknown';

export function getColumnTypeFromDataType(dataType: string): FilterType {
  if (!dataType) return 'unknown';
  if (['int', 'integer', 'float', 'double', 'decimal', 'number', 'bigint'].some(t => dataType.toLowerCase().includes(t))) {
    return 'number';
  }
  if (['bool', 'boolean'].some(t => dataType.toLowerCase().includes(t))) {
    return 'boolean';
  }
  if (['date', 'timestamp', 'datetime', 'time'].some(t => dataType.toLowerCase().includes(t))) {
    return 'date';
  }
  if (['string', 'text', 'varchar', 'char'].some(t => dataType.toLowerCase().includes(t))) {
    return 'string';
  }
  return 'unknown';
}

export function guessColumnTypeFromValue(value: any): FilterType {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    // Try date
    if (!isNaN(Date.parse(value))) return 'date';
    return 'string';
  }
  return 'unknown';
}
