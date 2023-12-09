const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for transactions
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a model for transactions
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to get all transactions
app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find().sort({ timestamp: 'desc' });
    res.json(transactions);
});

// API endpoint to add a new transaction
app.post('/transactions', async (req, res) => {
    const { description, amount, type } = req.body;
    const newTransaction = new Transaction({ description, amount, type });
    await newTransaction.save();
    res.sendStatus(201);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
