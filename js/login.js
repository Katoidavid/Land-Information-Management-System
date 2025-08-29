function toggleForms() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const formTitle = document.getElementById("form-title");
  const formSub = document.getElementById("form-sub");

  const isLogin = loginForm.style.display !== "none";

  if (isLogin) {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Create Account";
    formSub.textContent = "Fill in the details to register";
  } else {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "Land Information System";
    formSub.textContent = "Please login to continue";
  }

  document.getElementById("login-error").textContent = "";
  document.getElementById("register-error").textContent = "";
}

function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const error = document.getElementById("login-error");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    error.textContent = "Invalid username or password!";
  }
}

function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const error = document.getElementById("register-error");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    error.textContent = "Username already exists!";
    return;
  }

  if (password.length < 4) {
    error.textContent = "Password must be at least 4 characters.";
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  // Save new user
  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! Please login.");
  toggleForms();
}
