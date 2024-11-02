// Kini nga mga import gikan sa Firebase kay importante para ma-authenticate ang users
// ug ma-connect ta sa Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Kini ang configuration sa Firebase. Importante ni nga information para ma-connect
// ang atong application sa Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyBedLr4v6xdXWydp3mg44XGxNVzlpebJk4",
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
        
        // I-check kung admin ba ang nag-login
        if (identifier === 'admin' && password === 'admin') {
            successMessage.textContent = 'Admin login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorDiv.style.display = 'none';
            setTimeout(() => {
                window.location.href = 'welcome.html';
            }, 1500);
            return;
        }
        
        // Kuhaon ang mga users gikan sa localStorage
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
    
    // Kini ang mag-handle sa signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(signupForm)) return;
        
        const name = signupForm.querySelector('#signup-name').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;
        
        // I-save ang bag-ong user sa localStorage
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
                
                // I-save ang user data sa localStorage kung kinahanglan
                localStorage.setItem('googleUser', JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }));

                // Ipakita ang success message
                const successMessage = document.querySelector('#login-form .success-message');
                successMessage.textContent = 'Google login successful! Redirecting...';
                successMessage.style.display = 'block';
                
                // I-redirect human sa successful login
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1500);

            } catch (error) {
                console.error('Error during Google sign-in:', error);
                const errorDiv = document.querySelector('#login-form .error-message');
                errorDiv.textContent = 'Failed to login with Google';
                errorDiv.style.display = 'block';
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

// Kini ang special function para sa admin login
function loginAsAdmin() {
    showTab('login');
    const adminLoginText = document.querySelector('.admin-login-text');
    adminLoginText.style.display = 'block'; 
}

// Gi-expose nato ning mga functions sa window object para magamit sa HTML
window.showTab = showTab;
window.loginAsAdmin = loginAsAdmin;

