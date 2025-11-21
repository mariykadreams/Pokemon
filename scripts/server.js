const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // serve HTML, CSS, JS files

const USERS_FILE = './scripts/users.json';

// Helper to read users
function readUsers() {
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Helper to save users
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registration endpoint
// Registration endpoint
app.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;
        const users = readUsers();

        if (users.find(u => u.username === username)) {
            // Use 409 Conflict or 400 Bad Request for existing user
            return res.status(409).json({ message: 'Username already exists' });
        }

        users.push({ username, password }); // **Reminder: In a real app, hash the password!**
        saveUsers(users);
        res.status(201).json({ message: 'Registration successful' }); // Use 201 Created
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
