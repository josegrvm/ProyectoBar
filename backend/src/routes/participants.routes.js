import { Router } from 'express';
import Participant from '../models/Participant.js';

const router = Router();

// Crear participante
router.post('/:sessionId', async (req, res) => {
  try {
    const p = await Participant.create({ sessionId: req.params.sessionId, name: req.body.name, phone: req.body.phone, email: req.body.email });
    res.status(201).json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Eliminar participante
router.delete('/:id', async (req, res) => {
  try {
    await Participant.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
