import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Types
interface VitaminLog {
  id: string;
  device_id: string;
  vitamin_status: string;
  timestamp: string;
}

// In-memory data store for the tracker
const vitaminLogs: VitaminLog[] = [
  {
    id: 'init-1',
    device_id: 'SYSTEM',
    vitamin_status: 'Awaiting Connection...',
    timestamp: new Date().toISOString()
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GET route to retrieve logs for the dashboard
  app.get('/api/logs', (req, res) => {
    // Return latest logs first
    const sortedLogs = [...vitaminLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    res.json(sortedLogs);
  });

  // POST route required by ESP32-S3
  // Expected payload: { "device_id": "ESP32_S3_01", "vitamin_status": "Dispensed/Taken", "timestamp": "..." }
  app.post('/api/log_vitamin', (req, res) => {
    const { device_id, vitamin_status, timestamp } = req.body;
    
    if (!device_id || !vitamin_status) {
       res.status(400).json({ error: 'Missing required fields: device_id and vitamin_status' });
       return;
    }

    const newLog: VitaminLog = {
      id: Math.random().toString(36).substring(2, 9),
      device_id,
      vitamin_status,
      timestamp: timestamp || new Date().toISOString()
    };

    vitaminLogs.push(newLog);
    
    // Maintain a max history size so memory doesn't leak endlessly
    if (vitaminLogs.length > 100) {
      vitaminLogs.shift();
    }

    res.status(201).json({ message: 'Log received', log: newLog });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
