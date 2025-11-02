import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/db.js';
import sessionsRouter from './src/routes/sessions.routes.js';
import participantsRouter from './src/routes/participants.routes.js';
import itemsRouter from './src/routes/items.routes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/sessions', sessionsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/items', itemsRouter);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend on :${PORT}`));
});
