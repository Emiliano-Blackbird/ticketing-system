import mongoose, { mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Ticket from "../models/Tickets.js";

// Connect to the local MongoDB database
mongoose.connect("mongodb://localhost:27017/tickets-db")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const user = [
    { name: "user", role: "user", email: "user@example.com", passwordHash: "12345678" },
    { name: "admin", role: "admin", email: "admin@example.com", passwordHash: "12345678" }
];

const statuses = ["open", "closed"];
const priorities = ["low", "medium", "high"];

async function deleteCollections() {
    await User.deleteMany({});
    console.log("Deleted existing User collection");
    await Ticket.deleteMany({});
    console.log("Deleted existing Ticket collection");
}

async function createUsers() {
    for (const userData of user) {
        const user = new User(userData);
        await user.save();
    }
}

async function createTickets() {
    const users = await User.find({});

    for (let i = 0; i < 15; i++) {
        const ticket = new Ticket({
            title: `Sample Ticket #${i}`,
            description: `This is a description for sample ticket #${i}.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            user: users[Math.floor(Math.random() * users.length)].id
        });
        await ticket.save();
    }
}

async function populateDB() {
    await deleteCollections();
    await createUsers();
    await createTickets();
    console.log("Database population complete");
    mongoose.disconnect();
}

populateDB();