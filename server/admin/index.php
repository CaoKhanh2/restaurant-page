<?php
session_start();
if (isset($_SESSION['admin'])) {
    header('Location: /admin/dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin Login — Les 4 Saisons</title>
<link rel="stylesheet" href="/admin/assets/css/admin.css">
</head>
<body>
<div class="login-page">
  <div class="login-card">
    <div class="logo">
      <h1>🍜 Les 4 Saisons</h1>
      <p>Restaurant Dashboard</p>
    </div>
    <div id="error-msg"></div>
    <form id="loginForm" onsubmit="doLogin(event)">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" class="form-control" placeholder="admin" required autofocus>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" class="form-control" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn btn-primary" id="submitBtn">Sign in</button>
    </form>
  </div>
</div>

<script src="/admin/assets/js/admin.js"></script>
<script>
async function doLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const fd   = new FormData(e.target);
  const body = { username: fd.get('username'), password: fd.get('password') };
  const res  = await fetch('/admin/api/auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    location.href = '/admin/dashboard.php';
  } else {
    const data = await res.json();
    document.getElementById('error-msg').innerHTML =
      `<div class="alert alert-error">${data.error || 'Login failed'}</div>`;
    btn.disabled = false;
    btn.textContent = 'Sign in';
  }
}
</script>
</body>
</html>
