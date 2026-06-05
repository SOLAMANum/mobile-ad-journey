import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseCSV } from '../utils';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../data', 'gdelt_events_schema.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSV(csvContent);

    // Format response objects:
    const formattedRecords = records.map((r: any) => {
      let date = r.seendate || '';
      if (date && date.length >= 8) {
        date = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
      }
      
      const themes = r.themes ? r.themes.split(';') : [];
      const theme = themes.length > 0 ? themes[0] : 'LEGISLATION';

      return {
        date,
        domain: r.domain || '',
        title: r.title || '',
        theme
      };
    });

    res.json(formattedRecords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
