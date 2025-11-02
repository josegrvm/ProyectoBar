import { Router } from 'express';
import Item from '../models/Item.js';

const router = Router();

router.post('/:sessionId', async (req, res) => {
  try {
    const { name, unitPrice, quantity = 1, consumers = [] } = req.body;
    const it = await Item.create({ sessionId: req.params.sessionId, name, unitPrice, quantity, consumers });
    res.status(201).json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const it = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
