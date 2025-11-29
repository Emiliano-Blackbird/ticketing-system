import express from 'express';
import Ticket from '../models/Tickets.js';
import ticketSchema from '../validations/ticketValidation.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import buildFilter from '../middlewares/filter.js';
import paginate from '../middlewares/paginate.js';

const router = express.Router();

//  GET all tickets with filtering and pagination
//  GET /api/tickets
//  GET /api/tickets?pageSize=10&page=1
//  GET /api/tickets?status=open&priority=high
//  GET /api/tickets?search=bug
//  Public because I don't put auth middleware
router.get('/', buildFilter, paginate(Ticket), async (req, res) => {
    res.status(200).json(res.paginatedResults);
});

//  Create a ticket
//  POST /api/tickets
//  Private (only logged in users can create tickets)
//  Ticket Schema: title, description, priority, status
router.post('/', auth, async (req, res) => {
const {error} = ticketSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const ticket = new Ticket({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json({ ticket: newTicket });
    } catch (error) {
        res.status(400).json({ message: "Server error: " + error.message });
    }
});

//  Get a ticket by uid
//  GET /api/tickets/:id
//  Public
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ ticket: ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

//  Update a ticket by uid
//  PUT /api/tickets/:id
//  Private (only logged in users can update tickets)
//  Ticket Schema: title, description, priority, status
router.put('/:id', auth, async (req, res) => {  // Updated to use auth middleware
    const updates = req.body;
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ ticket: ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

//  Delete a ticket by uid
//  DELETE /api/tickets/:id
//  Private (only admin users can delete tickets)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ ticket: ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

export default router;
