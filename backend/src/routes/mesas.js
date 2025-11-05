import { Router } from "express";
import Mesa from "../models/Mesa.js";
import { authRequired } from "../utils/authMiddleware.js";

const router = Router();

/**
 * POST /mesas
 * Body: { barName, title, tipPercent, peopleCount }
 * Res:  { id }
 */
router.post("/", authRequired, async (req, res, next) => {
    try {
        const { barName, title, tipPercent, peopleCount } = req.body;

        if (!barName || !title || peopleCount == null) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const mesa = await Mesa.create({
        ownerId: req.user.id,
        barName,
        title,
        tipPercent: typeof tipPercent === "number" ? tipPercent : 10,
        peopleCount: Number(peopleCount) || 1
        });

        return res.status(201).json({ id: mesa._id });
    } catch (err) {
        next(err);
    }
    });

    /** (Opcional) GET /mesas/:id */
    router.get("/:id", authRequired, async (req, res, next) => {
    try {
        const mesa = await Mesa.findById(req.params.id);
        if (!mesa) return res.status(404).json({ error: "Mesa no encontrada" });
        // Permitir ver si eres el dueño; si luego agregas invitados, ajusta esto.
        if (mesa.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Sin permiso" });
        }
        res.json({ mesa });
    } catch (err) {
        next(err);
    }
});

export default router;
