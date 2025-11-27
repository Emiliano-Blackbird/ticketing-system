import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, required: true, unique: true },
    user: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    title: { type: String, required: true },
    description: { type: String, required: true },
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret._id;
        },  // Eliminar campos innecesarios de la respuesta JSON
        virtuals: true,
    },
});

ticketSchema.index({ id: 1, user: 1 });  // Índice compuesto para optimizar consultas por id y usuario

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
