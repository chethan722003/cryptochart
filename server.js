const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define the file path for your manually created notepad file
const filePath = path.join(__dirname, 'store.txt');

// Simple route to handle form submission
app.post('/login', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    // Format the login data to write to the notepad file
    const loginData = `Name: ${name}, Email: ${email}, Password: ${password}\n`;

    // Append the login data to the notepad (store.txt) file
    fs.appendFile(filePath, loginData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Error storing login data' });
        }

        console.log('Login details stored in notepad file');
        res.status(200).json({ message: 'Login successful', name });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
