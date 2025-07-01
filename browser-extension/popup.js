document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const status = document.getElementById('status');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      status.textContent = 'Please enter email and password.';
      return;
    }

    try {
      // Call backend login API to get auth token
      const response = await fetch('https://focusly-an-activity-analyzer.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors'
      });

    if (!response.ok) {
      const errorData = await response.json();
      status.textContent = 'Login failed: ' + (errorData.message || 'Please check your credentials.');
      return;
    }

      const data = await response.json();
      const token = data.token;

      if (token) {
        // Save token in chrome storage
        chrome.storage.local.set({ authToken: token }, () => {
          console.log('Auth token saved:', token);
          status.textContent = 'Login successful!';
          setTimeout(() => {
            status.textContent = '';
          }, 3000);
        });
      } else {
        status.textContent = 'Login failed: No token received.';
      }
    } catch (error) {
      status.textContent = 'Error during login: ' + error.message;
    }
  });
});
