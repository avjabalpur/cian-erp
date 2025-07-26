export function exportToCSV(data: any[], columns: string[], filename = 'export.csv') {
  if (!data || !columns || columns.length === 0) return;
  const header = columns.join(',');
  const rows = data.map(row =>
    columns.map(col => {
      let cell = row[col];
      if (typeof cell === 'object' && cell !== null) cell = JSON.stringify(cell);
      if (cell === undefined || cell === null) cell = '';
      return `"${String(cell).replace(/"/g, '""')}`;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
