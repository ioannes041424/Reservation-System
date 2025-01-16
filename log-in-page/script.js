// Kini nga import gikan sa Firebase kay importante para ma-authenticate ang users
// ug ma-connect ta sa Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Kini ang configuration sa Firebase. Importante ni nga information para ma-connect
// ang atong application sa Firebase project
const firebaseConfig = {
    apiKey: "API-KEY-HERE",
    authDomain: "reservation-system-login.firebaseapp.com",
    projectId: "reservation-system-login",
    storageBucket: "reservation-system-login.firebasestorage.app",
    messagingSenderId: "877920417271",
    appId: "1:877920417271:web:6ae2dbe8c0cca855fdeaf2"
};

// Kini ang pag-setup sa Firebase ug authentication services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// track sa login as admin
let isAdminLogin = false;

// Maghulat ta nga ma-load ang HTML sa dili pa mag-start ang JavaScript code
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

   // Kini ang mag-handle sa login form submission
   loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = loginForm.querySelector('#login-identifier').value;
    const password = loginForm.querySelector('#login-password').value;
    const successMessage = loginForm.querySelector('.success-message');
    const errorDiv = loginForm.querySelector('.error-message');

    // Check if admin login is active
    if (isAdminLogin) {
        if (identifier === 'admin' && password === 'admin123') {
            successMessage.textContent = 'Admin login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none';
            setTimeout(() => {
                window.location.href = '../adminpage-dashboard/index.html'; // Redirect to homepage
            }, 1500);
            return;
        } else {
            errorDiv.textContent = 'Invalid admin credentials';
            errorDiv.style.display = 'block';
            successMessage.style.display = 'none';
            return;
        }
    }

    // Regular login logic for students
    try {
        // Send login request to the server
        const response = await fetch("http://localhost:3001/api/signin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: identifier, password }),
        });

        if (response.ok) {
            const user = await response.json(); // Assuming the server responds with user data
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none';
            setTimeout(() => {
                window.location.href = '../homepage/index.html'; // Redirect to homepage
            }, 1500);
        } else {
            const errorMessage = await response.json();
            errorDiv.textContent = errorMessage.message || 'Invalid credentials';
            errorDiv.style.display = 'block';
            successMessage.style.display = 'none';
        }
    } catch (error) {
        console.error("Error during login:", error);
        errorDiv.textContent = 'An error occurred during login';
        errorDiv.style.display = 'block';
        successMessage.style.display = 'none';
    }
});


    // Kini ang mag-handle sa signup form submission
    signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(signupForm)) return;

    // Kuhaon ang mga input values gikan sa signup form
    const name = signupForm.querySelector('#signup-name').value;
    const email = signupForm.querySelector('#signup-email').value;
    const password = signupForm.querySelector('#signup-password').value;

    // I-define ang mga message elements para magpakita ug success o error messages
    const successMessage = signupForm.querySelector('.success-message');
    const errorDiv = signupForm.querySelector('.error-message');

    try {
        // Mag-send ug HTTP POST request ngadto sa atong backend server sa /register route
        // Gamiton nato ang fetch function para magpadala ug JSON data sa server
        const response = await fetch("http://localhost:3001/api/signup", {  // Corrected endpoint
            method: "POST", // Kini mag-sulti nga POST request ni, meaning mag-submit ta ug data
            headers: {
                "Content-Type": "application/json" // Set ang content type nga JSON para ma-recognize sa server
            },
            body: JSON.stringify({ name, email, password }) // I-convert ang data sa JSON format
        });

        // Ikuha ang result gikan sa response pinaagi sa pag-parse sa JSON data gikan sa server
        const result = await response.json();

        // I-check kung successful ba ang response status gikan sa server
        if (response.ok) {
            // Kung successful, pakit-on nato ang success message sa user
            successMessage.textContent = result.message; // Ang message gikan sa backend server
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none'; // Hide ang error message kung naa

            // I-clear ang form human ma-submit ug mag-redirect sa login page
            signupForm.reset(); // I-reset ang form fields
            setTimeout(() => {
                showTab('login'); // Switch ang tab ngadto sa login form
            }, 1500);
        } else {
            // Kung dili successful ang response, i-display ang error message nga gikan sa backend
            throw new Error(result.message);
        }
    } catch (error) {
        // I-display ang error message kung naa man gani exception sa pag-send sa request
        errorDiv.textContent = error.message || 'Failed to register. Please try again.';
        errorDiv.style.display = 'block';
        successMessage.style.display = 'none'; // Hide ang success message kung naa
    }
});

    // Kini ang feature nga maka-toggle sa password visibility
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Kini ang setup sa Google Sign-in feature
    function initializeGoogleSignIn() {
        const googleBtn = document.querySelector('.custom-google-btn');
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Send user data to our backend
                const response = await fetch("http://localhost:3001/api/google-signin", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: user.displayName,
                        email: user.email
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate with backend');
                }

                const data = await response.json();

                // Store the token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('googleUser', JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }));

                // Ipakita ang success message
                const successMessage = document.querySelector('#login-form .success-message');
                const errorDiv = document.querySelector('#login-form .error-message');
                successMessage.textContent = 'Google login successful! Redirecting...';
                successMessage.style.display = 'block';
                errorDiv.style.display = 'none';

                // I-redirect human sa successful login
                setTimeout(() => {
                    window.location.href = '../homepage/index.html';
                }, 1500);

            } catch (error) {
                console.error('Error during Google sign-in:', error);
                const errorDiv = document.querySelector('#login-form .error-message');
                const successMessage = document.querySelector('#login-form .success-message');
                errorDiv.textContent = 'Failed to login with Google';
                errorDiv.style.display = 'block';
                successMessage.style.display = 'none';
            }
        });
    }

    initializeGoogleSignIn();
});

// Kini nga function kay mag-check kung valid ba ang form inputs
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

// Kini nga function kay mag-check kung valid ba ang email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Kini ang mag-switch sa forms between login ug signup
function showTab(tabName) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const adminLoginText = document.querySelector('.admin-login-text');
    
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    
    if (tabName === 'login') {
        loginForm.style.display = 'block';
        adminLoginText.style.display = isAdminLogin ? 'block' : 'none';
    } else {
        signupForm.style.display = 'block';
        adminLoginText.style.display = 'none';
    }
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab:nth-child(${tabName === 'login' ? '1' : '2'})`);
    activeTab.classList.add('active');
}

function toggleAdminLogin() {
    const adminLoginText = document.querySelector('.admin-login-text');
    const adminLoginLink = document.querySelector('.admin-login');
    
    isAdminLogin = !isAdminLogin; // Toggle the state
    
    // Update UI elements
    adminLoginLink.textContent = isAdminLogin ? 'Login as Student' : 'Login as Admin';
    adminLoginText.style.display = isAdminLogin ? 'block' : 'none';
    
    // Clear form fields
    document.getElementById('login-identifier').value = '';
    document.getElementById('login-password').value = '';
    
    showTab('login');
}

// Single event listener for admin login functionality
document.addEventListener('DOMContentLoaded', () => {
    const adminLoginLink = document.querySelector('.admin-login');
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAdminLogin();
    });
});

// Expose functions to window object
window.showTab = showTab;
window.toggleAdminLogin = toggleAdminLogin;
