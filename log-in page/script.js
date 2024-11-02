document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Form submission handlers
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = loginForm.querySelector('#login-identifier').value;
        const password = loginForm.querySelector('#login-password').value;
        const successMessage = loginForm.querySelector('.success-message');
        const errorDiv = loginForm.querySelector('.error-message');
        
        // Check for admin login
        if (identifier === 'admin' && password === 'admin') {
            successMessage.textContent = 'Admin login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none';
            setTimeout(() => {
                window.location.href = 'welcome.html';
            }, 1500);
            return;
        }
        
        // Retrieve stored users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => (user.name === identifier || user.email === identifier) && user.password === password);
        
        if (user) {
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none';
            setTimeout(() => {
                window.location.href = 'welcome.html';
            }, 1500);
        } else {
            errorDiv.textContent = 'Invalid credentials';
            errorDiv.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(signupForm)) return;
        
        const name = signupForm.querySelector('#signup-name').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;
        
        // Retrieve existing users and add new user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        const successMessage = signupForm.querySelector('.success-message');
        successMessage.textContent = 'Account created successfully!';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            showTab('login');
        }, 1500);
    });
    
    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });
});

// Form validation helper (only for regular users and signup)
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        const errorDiv = input.parentElement.querySelector('.error-message');
        errorDiv.style.display = 'none';
        
        if (!input.value.trim()) {
            errorDiv.textContent = 'This field is required';
            errorDiv.style.display = 'block';
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            errorDiv.textContent = 'Please enter a valid email address';
            errorDiv.style.display = 'block';
            isValid = false;
        } else if (input.type === 'password' && input.value.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            errorDiv.style.display = 'block';
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Tab switching
function showTab(tabName) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const adminLoginText = document.querySelector('.admin-login-text');
    
    // Hide both forms
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    
    // Show selected form
    if (tabName === 'login') {
        loginForm.style.display = 'block';
    } else {
        signupForm.style.display = 'block';
        adminLoginText.style.display = 'none'; // Hide admin login text when switching to signup
    }
    
    // Update tab styling
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab:nth-child(${tabName === 'login' ? '1' : '2'})`);
    activeTab.classList.add('active');
}

// Admin login handler - just switches to login tab
function loginAsAdmin() {
    showTab('login');
    const adminLoginText = document.querySelector('.admin-login-text');
    adminLoginText.style.display = 'block'; // Show the admin login text
}

// Expose necessary functions to window
window.showTab = showTab;
window.loginAsAdmin = loginAsAdmin;

function printAllUsers() {
    // Retrieve the users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Log each user to the console
    users.forEach(user => {
        console.log(`Name: ${user.name}, Email: ${user.email}`);
    });
}

// Call the function to print all users
printAllUsers();

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    console.log("ID: " + data.sub);
    console.log('Full Name: ' + data.name);
    console.log('Given Name: ' + data.given_name);
    console.log('Family Name: ' + data.family_name);
    console.log("Image URL: " + data.picture);
    console.log("Email: " + data.email);

    // Here you can handle the user data, e.g., send it to your server
    // or store it in localStorage
    const successMessage = document.querySelector('.success-message');
    successMessage.textContent = 'Google login successful! Redirecting...';
    successMessage.style.display = 'block';

    setTimeout(() => {
        window.location.href = 'welcome.html';
    }, 1500);
}

// Initialize the Google Sign-In button
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '132072170455-0as6fhmn49ahqetbss07829mag18l1q9.apps.googleusercontent.com', // Ensure this is correct
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.querySelector('.google-btn'), // Ensure this element exists
        { theme: 'outline', size: 'large' } // Customization options
    );

    google.accounts.id.prompt(); // Display the One Tap prompt
};

