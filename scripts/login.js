function isPasswordFormatValid(password) {

    if (password.length < 8) return false;
    const capitalCount = (password.match(/[A-Z]/g) || []).length;
    if (capitalCount < 2) return false;

    if (!/\d/.test(password)) return false;

    if (!/[^A-Za-z0-9\s]/.test(password)) return false;

    return true;
}

async function loadRegisteredUsers() {
    try {
        const response = await fetch('../scripts/users.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching user data:', error);

        const messageElement = document.getElementById('message');
        if (messageElement) {
             messageElement.innerText = '❌ Failed to load user data. Please check the console.';
             messageElement.style.color = 'red';
        }

        return [];
    }
}

async function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('message');

    messageElement.innerText = '';
    messageElement.style.color = 'inherit'; 

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!isPasswordFormatValid(password)) {
        messageElement.innerText = '❌ Invalid password format. Check requirements: min 8 chars, 2 capitals, 1 digit, 1 special character.';
        messageElement.style.color = 'red';
        return;
    }
    
    const registeredUsers = await loadRegisteredUsers();

    const user = registeredUsers.find(
        u => u.username === username && u.password === password
    );

    if (user) {

        messageElement.innerText = '✅ Login successful! Welcome, ' + username + '!';
        messageElement.style.color = 'green';
        
        usernameInput.value = '';
        passwordInput.value = '';
        
        setTimeout(() => {
            window.location.href = '../index.html'; 
        }, 500); 

    } else {
        messageElement.innerText = '❌ Invalid username or password.';
        messageElement.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    } else {
        console.error('Login button (id="loginButton") not found in the DOM.');
    }
});