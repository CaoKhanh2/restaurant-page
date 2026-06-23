<?php
session_start();
if (isset($_SESSION['admin'])) {
    header('Location: /dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard Login — Les 4 Saisons</title>
<link rel="stylesheet" href="/assets/css/admin.css?v=2">
</head>
<body>
<div class="login-page">
  <div class="login-card">
    <div class="logo">
      <h1>🍜 Les 4 Saisons</h1>
      <p>Restaurant Dashboard</p>
    </div>
    <div id="error-msg"></div>
    <form id="loginForm" onsubmit="doLogin(event)" autocomplete="off">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" class="form-control" autocomplete="off" required autofocus>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" class="form-control" autocomplete="new-password" required>
      </div>
      <button type="submit" class="btn btn-primary" id="submitBtn">Sign in</button>
    </form>
  </div>
</div>

<script src="/assets/js/admin.js?v=2"></script>
<script>
async function doLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  const fd   = new FormData(e.target);
  const body = { username: fd.get('username'), password: fd.get('password') };
  try {
    const res = await fetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      location.href = '/dashboard.php';
      return;
    }

    let message = res.status >= 500
      ? `Server error (${res.status}). Check backend configuration.`
      : `Login failed (${res.status})`;

    if ((res.headers.get('content-type') || '').includes('application/json')) {
      const data = await res.json();
      message = data.error || message;
    }

    showLoginError(message);
  } catch (error) {
    showLoginError('Network error. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign in';
  }
}

function showLoginError(message) {
  const target = document.getElementById('error-msg');
  target.innerHTML = '';

  const alert = document.createElement('div');
  alert.className = 'alert alert-error';
  alert.textContent = message;
  target.appendChild(alert);
}
</script>
</body>
</html>
