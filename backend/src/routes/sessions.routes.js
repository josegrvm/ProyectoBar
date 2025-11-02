import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import Session from '../models/Session.js';
import Participant from '../models/Participant.js';
import Item from '../models/Item.js';
import { computeSummary } from '../utils/computeSummary.js';

const router = Router();
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 7);

// Crear mesa
router.post('/', async (req, res) => {
  try {
    const { title, tipPercent = 10, taxPercent = 0, currency = 'CLP' } = req.body;
    const code = nano();
    const session = await Session.create({ title, tipPercent, taxPercent, currency, code });
    res.status(201).json(session);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Obtener mesa por código
router.get('/code/:code', async (req, res) => {
  try {
    const session = await Session.findOne({ code: req.params.code });
    if(!session) return res.status(404).json({ error: 'Session not found' });

    const [participants, items] = await Promise.all([
      Participant.find({ sessionId: session._id }),
      Item.find({ sessionId: session._id })
    ]);

    res.json({ session, participants, items });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Actualizar config
router.patch('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(session);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Resumen
router.get('/:id/summary', async (req, res) => {
  try {
    const [session, participants, items] = await Promise.all([
      Session.findById(req.params.id),
      Participant.find({ sessionId: req.params.id }),
      Item.find({ sessionId: req.params.id })
    ]);
    if(!session) return res.status(404).json({ error: 'Session not found' });
    const summary = computeSummary({
      items, participants,
      tipPercent: session.tipPercent,
      taxPercent: session.taxPercent
    });
    res.json(summary);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Cerrar mesa
router.post('/:id/close', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    res.json(session);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
