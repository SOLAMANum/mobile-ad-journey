import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const trackingEnabled = req.query.trackingEnabled !== 'false';

  const journeyData = [
    { time: '08:00', dataBrokers: trackingEnabled ? 2 : 0, adNetworks: 1 },
    { time: '10:00', dataBrokers: trackingEnabled ? 5 : 0, adNetworks: 3 },
    { time: '12:00', dataBrokers: trackingEnabled ? 12 : 0, adNetworks: 7 },
    { time: '14:00', dataBrokers: trackingEnabled ? 18 : 0, adNetworks: 10 },
    { time: '16:00', dataBrokers: trackingEnabled ? 24 : 0, adNetworks: 14 },
    { time: '18:00', dataBrokers: trackingEnabled ? 35 : 0, adNetworks: 20 },
  ];

  res.json(journeyData);
});

export default router;
