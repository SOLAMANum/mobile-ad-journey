import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { parseCSV } from '../utils';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const trackingEnabled = req.query.trackingEnabled !== 'false';
    const filterOwner = req.query.owner as string | undefined;
    const filterRisk = req.query.risk as string | undefined;
    const filterDate = req.query.date as string | undefined;

    const filePath = path.join(__dirname, '../../data', 'mobile_ad_id_journey_sample.csv');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const rawEvents = parseCSV(csvContent);

    // Process all events and extract metadata
    const processedEvents = rawEvents.map((r: any) => {
      const timestamp = r.timestamp || '';
      const date = timestamp ? timestamp.substring(0, 10) : '';

      // Determine owner
      const chain = r.partner_chain_exposure || 'App';
      const parts = chain.split('->').map((p: any) => p.trim());
      const owner = parts[parts.length - 1] || 'Internal Analytics';

      // Determine risk
      const att = r.app_tracking_transparency_opt_in === 'True';
      const loc = r.location_permission_granted === 'True';
      let risk = 'Medium';
      if (att && loc) {
        risk = 'High';
      } else if (!att && !loc) {
        risk = 'Low';
      }

      // Check exposed status
      const originalMaid = r.maid_apple_idfa_or_google_aaid || '00000000-0000-0000-0000-000000000000';
      const maid = trackingEnabled ? originalMaid : '00000000-0000-0000-0000-000000000000';
      const maidExposed = trackingEnabled && originalMaid !== '00000000-0000-0000-0000-000000000000';

      return {
        timestamp,
        date,
        originalMaid,
        maid,
        maidExposed,
        app: r.app_context || 'Unknown App',
        eventType: r.event_type || 'background_sync',
        chain,
        owner,
        risk,
        locationPermission: loc,
        attOptIn: att,
        source: r.source_feed || 'Synthetic'
      };
    });

    // Extract unique filter lists from the ENTIRE dataset so filters don't disappear when selected
    const allOwners = Array.from(new Set(processedEvents.map((e: any) => e.owner))).filter(Boolean).sort();
    const allRisks = ['High', 'Medium', 'Low'];
    const allDates = Array.from(new Set(processedEvents.map((e: any) => e.date))).filter(Boolean).sort().reverse();

    // Apply filters
    let filteredEvents = processedEvents;
    if (filterOwner && filterOwner !== 'all') {
      filteredEvents = filteredEvents.filter((e: any) => e.owner === filterOwner);
    }
    if (filterRisk && filterRisk !== 'all') {
      filteredEvents = filteredEvents.filter((e: any) => e.risk === filterRisk);
    }
    if (filterDate && filterDate !== 'all') {
      filteredEvents = filteredEvents.filter((e: any) => e.date === filterDate);
    }

    // Compute stats based on the FILTERED dataset
    const ownerCounts: Record<string, number> = {};
    filteredEvents.forEach((e: any) => {
      ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
    });

    const totalFiltered = filteredEvents.length || 1;
    const ownerStats = Object.entries(ownerCounts)
      .map(([owner, count]) => ({
        owner,
        count,
        percentage: Math.round((count / totalFiltered) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      events: filteredEvents,
      filters: {
        owners: allOwners,
        risks: allRisks,
        dates: allDates
      },
      stats: {
        ownerStats,
        totalEvents: filteredEvents.length,
        highRiskCount: filteredEvents.filter((e: any) => e.risk === 'High').length,
        mediumRiskCount: filteredEvents.filter((e: any) => e.risk === 'Medium').length,
        lowRiskCount: filteredEvents.filter((e: any) => e.risk === 'Low').length
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
