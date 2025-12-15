const API_URL = 'https://final-project-0hy5.onrender.com/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBox = document.querySelector('.login-box');
const registerBox = document.querySelector('.register-box');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const errorMessage = document.getElementById('errorMessage');
const registerErrorMessage = document.getElementById('registerErrorMessage');

// Check if user is already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'marketplace.html';
}

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';
    errorMessage.style.display = 'none';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerBox.style.display = 'none';
    loginBox.style.display = 'block';
    registerErrorMessage.style.display = 'none';
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Tentando login com:', email);
    
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userName', data.user.name);
            window.location.href = 'marketplace.html';
        } else {
            showError(errorMessage, data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        showError(errorMessage, 'Erro ao conectar com o servidor: ' + error.message);
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    console.log('Tentando criar conta:', { name, email, phone });
    
    try {
        // Primeiro, cria o usuário
        const registerResponse = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        console.log('Status do cadastro:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('Dados do cadastro:', registerData);
        
        if (registerResponse.ok) {
            console.log('Usuário criado, fazendo login automático...');
            // Depois faz login automático
            const loginResponse = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const loginData = await loginResponse.json();
            console.log('Dados do login:', loginData);
            
            if (loginResponse.ok) {
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('userId', loginData.user.id);
                localStorage.setItem('userName', loginData.user.name);
                window.location.href = 'marketplace.html';
            } else {
                showError(registerErrorMessage, 'Conta criada, mas erro ao fazer login: ' + (loginData.message || 'Erro desconhecido'));
            }
        } else {
            showError(registerErrorMessage, registerData.message || 'Erro ao criar conta');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        showError(registerErrorMessage, 'Erro ao conectar com o servidor: ' + error.message);
    }
});

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}
