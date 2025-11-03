/**
 * Authentication Module - User login and registration
 */

/**
 * Handle user registration
 */
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const phone = document.getElementById('regPhone').value;

    const errorDiv = document.getElementById('registerError');
    errorDiv.classList.remove('show');

    try {
        const response = await registerUser({
            username,
            email,
            password,
            firstName,
            lastName,
            phoneNumber: phone
        });

        // Store authentication data
        storeAuthData(response.data.token, response.data);

        // Update UI
        updateAuthUI();

        // Clear form
        const registerFormDiv = document.getElementById('registerForm');
        const registerForm = registerFormDiv.querySelector('form');
        if (registerForm) registerForm.reset();

        // Show success and redirect
        alert('Registration successful! Welcome to Flight Booking System.');
        showPage('home');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

/**
 * Handle user login
 */
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const errorDiv = document.getElementById('loginError');
    errorDiv.classList.remove('show');

    try {
        const response = await loginUser(username, password);

        // Store authentication data
        storeAuthData(response.data.token, response.data);

        // Update UI
        updateAuthUI();

        // Clear form
        const loginFormDiv = document.getElementById('loginForm');
        const loginForm = loginFormDiv.querySelector('form');
        if (loginForm) loginForm.reset();

        // Show success and redirect
        alert('Login successful!');
        showPage('home');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

/**
 * Handle user logout
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        clearAuthData();
        updateAuthUI();
        showPage('home');
        alert('You have been logged out.');
    }
}

/**
 * Toggle between login and registration forms
 */
function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

/**
 * Update UI based on authentication status
 */
function updateAuthUI() {
    const authNav = document.getElementById('authNav');
    const bookingsNav = document.getElementById('bookingsNav');
    const profileNav = document.getElementById('profileNav');
    const logoutNav = document.getElementById('logoutNav');

    if (isAuthenticated()) {
        // User is logged in
        authNav.style.display = 'none';
        bookingsNav.style.display = 'block';
        profileNav.style.display = 'block';
        logoutNav.style.display = 'block';
    } else {
        // User is not logged in
        authNav.style.display = 'block';
        bookingsNav.style.display = 'none';
        profileNav.style.display = 'none';
        logoutNav.style.display = 'none';
    }
}

/**
 * Check authentication on page load
 */
function initializeAuth() {
    updateAuthUI();
}
