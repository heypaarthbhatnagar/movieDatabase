// Handle Sign Up and Login Logic
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Sign Up Logic
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("signup-username").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            if (!validateEmail(email)) {
                alert("Invalid email address!");
                return;
            }

            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);

            alert("Sign-up successful! Redirecting to login...");
            window.location.href = "login.html";
        });
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const rememberMe = document.getElementById("remember-me").checked;

            const storedUsername = localStorage.getItem("username");
            const storedPassword = localStorage.getItem("password");

            if (username === storedUsername && password === storedPassword) {
                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("rememberMe");
                }
                alert("Login successful! Redirecting...");
                window.location.href = "index.html";
            } else {
                alert("Invalid username or password!");
            }
        });

        // Auto-login if "Remember Me" is checked
        if (localStorage.getItem("rememberMe") === "true") {
            window.location.href = "index.html";
        }
    }
});

// Show/Hide Password
function togglePassword(id) {
    const passwordField = document.getElementById(id);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

// Password Strength Indicator
function checkPasswordStrength() {
    const password = document.getElementById("signup-password").value;
    const strengthIndicator = document.getElementById("password-strength");
    let strength = "Weak";
    let color = "red";

    if (password.length > 7 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = "Strong";
        color = "green";
    } else if (password.length > 5) {
        strength = "Medium";
        color = "orange";
    }
    strengthIndicator.innerText = `Strength: ${strength}`;
    strengthIndicator.style.color = color;
}

// Email Validation
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(email);
}

// Sign Out and Auto Auth Management
document.addEventListener("DOMContentLoaded", () => {
    const authLink = document.getElementById("auth-link");
    const signoutBtnContainer = document.getElementById("signout-btn-container");
    const signoutBtn = document.getElementById("signout-btn");

    // Check if user is logged in
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
        if (authLink) authLink.style.display = "none";
        if (signoutBtnContainer) signoutBtnContainer.style.display = "inline-block";
    } else {
        if (authLink) authLink.style.display = "inline-block";
        if (signoutBtnContainer) signoutBtnContainer.style.display = "none";
    }

    // Sign Out Logic
    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            alert("Signed out successfully! Redirecting to login...");
            window.location.href = "login.html";
        });
    }
});
