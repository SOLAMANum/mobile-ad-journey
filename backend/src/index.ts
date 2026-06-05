import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';
import cfpbRouter from './routes/cfpb';
import gdeltRouter from './routes/gdelt';
import journeyRouter from './routes/journey';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/cfpb', cfpbRouter);
app.use('/api/gdelt', gdeltRouter);
app.use('/api/journey', journeyRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
