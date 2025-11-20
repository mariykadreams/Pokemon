const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // serve HTML, CSS, JS files

const USERS_FILE = './users.json';

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
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users.push({ username, password }); // store password as plain text (for demo only)
    saveUsers(users);
    res.json({ message: 'Registration successful' });
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
