require('dotenv').config(); // To use environment variables
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Create an instance of express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create the employee table if it doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        city VARCHAR(255) NOT NULL
    );
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Employees table is ready.');
    }
});

// Routes

// Get all employees
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            return res.status(500).json({ error: 'Failed to fetch employees' });
        }
        res.json(results);
    });
});

// Add an employee
app.post('/employees', (req, res) => {
    const { name, position, salary, city } = req.body;
    const query = 'INSERT INTO employees (name, position, salary, city) VALUES (?, ?, ?, ?)';
    db.query(query, [name, position, salary, city], (err, result) => {
        if (err) {
            console.error('Error adding employee:', err.message);
            return res.status(500).json({ error: 'Failed to add employee' });
        }
        res.json({ id: result.insertId });
    });
});

// Update an employee
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, salary, city } = req.body;
    const query = 'UPDATE employees SET name = ?, position = ?, salary = ?, city = ? WHERE id = ?';
    db.query(query, [name, position, salary, city, id], (err) => {
        if (err) {
            console.error('Error updating employee:', err.message);
            return res.status(500).json({ error: 'Failed to update employee' });
        }
        res.json({ message: 'Employee updated' });
    });
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting employee:', err.message);
            return res.status(500).json({ error: 'Failed to delete employee' });
        }
        res.json({ message: 'Employee deleted' });
    });
});

// Start the server
const port = process.env.PORT || 5008;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
