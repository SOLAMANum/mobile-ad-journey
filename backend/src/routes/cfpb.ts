import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseCSV } from '../utils';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../data', 'cfpb_complaints_schema.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSV(csvContent);

    // Format the response objects slightly to match page.tsx expectations
    const formattedRecords = records.map((r: any) => ({
      date: r.date_received || '',
      company: r.company || '',
      issue: r.issue || '',
      desc: r.complaint_what_happened || ''
    }));

    res.json(formattedRecords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
