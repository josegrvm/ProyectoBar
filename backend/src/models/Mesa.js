import mongoose from "mongoose";
const { Schema } = mongoose;

const MesaSchema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // quién la creó
        barName: { type: String, required: true, trim: true },
        title:   { type: String, required: true, trim: true },
        tipPercent: { type: Number, min: 0, max: 100, default: 10 },
        peopleCount: { type: Number, min: 1, required: true },

        // Puedes ir agregando más campos luego (estado, items, código QR, etc.)
        status: { type: String, enum: ["open", "closed"], default: "open" }
    },
    { timestamps: true }
);

export default mongoose.model("Mesa", MesaSchema);
