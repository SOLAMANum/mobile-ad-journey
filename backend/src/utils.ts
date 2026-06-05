/**
 * Parses a CSV string into an array of objects based on the header row.
 * Handles quoted fields containing commas correctly.
 */
export function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split(/\r?\n/);
  if (lines.length === 0 || !lines[0]) return [];
  
  // Clean headers (remove quotes and whitespace)
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    if (values.length >= headers.length) {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] !== undefined ? values[index] : '';
      });
      results.push(obj);
    }
  }
  return results;
}
