/* =============================================
   SQLCode Auth - Login / Signup / OTP / Forgot Password
   Connects to Google Apps Script → Google Sheet + Gmail
   ============================================= */

// =============================================
// ⚠️  PASTE YOUR DEPLOYED APPS SCRIPT URL HERE
// After deploying the gscript.gs, you get a URL like:
// https://script.google.com/macros/s/AKfycb...xxxxx.../exec
// =============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydPOfsAKCnJhGzSEJK05t5ovN7LBrkTxkPGGhJmGi3iUKi4DRl5lw40NBzoKuhHTqa/exec';

// =============================================
// STATE
// =============================================
const authState = {
    currentUser: JSON.parse(localStorage.getItem('sqlcode_user') || 'null'),
    pendingSignupEmail: null,
    currentOTP: null,
    otpTimer: null,
    otpExpiry: null,
    apiAvailable: false,
};

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    // If already logged in, redirect to main app
    if (authState.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Check if Apps Script URL is configured
    authState.apiAvailable = SCRIPT_URL && SCRIPT_URL.startsWith('https://script.google.com/macros/s/');

    if (!authState.apiAvailable) {
        showSetupBanner();
    }

    createFloatingCode();
    bindAuthEvents();
    setupOTPInputs();
    setupPasswordStrength();
});

// =============================================
// API CALL — JSONP via <script> injection
// =============================================
// Google Apps Script doesn't set CORS headers, so we can't use fetch() for POST.
// Instead we send all data as GET query params and the Apps Script wraps the
// response in a callback function (JSONP).  A <script> tag executes it and
// delivers the result back to our JS.
// =============================================
async function callAPI(action, data = {}) {
    if (!authState.apiAvailable) {
        return { success: false, message: 'Apps Script URL not configured. Add your deployed URL to auth.js' };
    }

    const callbackName = 'sqlcode_cb_' + Date.now();

    // Build query string — every param is a string, safe to URL-encode
    const params = new URLSearchParams();
    params.append('action', action);
    params.append('callback', callbackName);
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            params.append(key, String(data[key]));
        }
    });

    return new Promise((resolve) => {
        let cleaned = false;
        function cleanup() {
            if (cleaned) return;
            cleaned = true;
            delete window[callbackName];
            if (script && script.parentNode) script.parentNode.removeChild(script);
        }

        window[callbackName] = function (result) {
            cleanup();
            resolve(result);
        };

        const script = document.createElement('script');
        script.src = SCRIPT_URL + '?' + params.toString() + '&_=' + Date.now();
        script.onerror = function () {
            cleanup();
            resolve({ success: false, message: 'Failed to connect to server' });
        };
        document.head.appendChild(script);

        // 15-second timeout
        setTimeout(() => {
            if (window[callbackName]) {
                cleanup();
                resolve({ success: false, message: 'Request timed out' });
            }
        }, 15000);
    });
}

// =============================================
// FORM NAVIGATION
// =============================================
function showForm(formId) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove('hidden');
        form.style.animation = 'none';
        form.offsetHeight;
        form.style.animation = '';
    }
}

function showSetupBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: #1a1a2e; padding: 12px 20px; text-align: center;
        font-size: 13px; font-weight: 600; font-family: var(--font);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        ⚠️ Setup Required: Paste your Google Apps Script URL in <code>auth.js</code> (SCRIPT_URL variable).
        <a href="#" onclick="this.parentElement.remove()" style="color:#1a1a2e; text-decoration:underline; margin-left:12px;">Dismiss</a>
    `;
    document.body.appendChild(banner);
}

// =============================================
// LOGIN
// =============================================
async function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;

    if (!email) { showInputError('loginEmailError', 'Email is required'); valid = false; }
    else if (!isValidEmail(email)) { showInputError('loginEmailError', 'Enter a valid email'); valid = false; }
    if (!password) { showInputError('loginPasswordError', 'Password is required'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('loginBtn');
    btn.classList.add('loading');

    try {
        if (authState.apiAvailable) {
            // Call Apps Script API
            const result = await callAPI('login', { email, password });
            btn.classList.remove('loading');

            if (!result.success) {
                if (result.needsVerification) {
                    // Redirect to OTP verification
                    authState.pendingSignupEmail = email;
                    document.getElementById('otpEmailDisplay').textContent = email;
                    showForm('otpForm');
                    startOTPTimer();
                    showToast('Please verify your email first', 'info');
                } else {
                    showInputError('loginPasswordError', result.message || 'Login failed');
                }
                return;
            }

            // Login successful
            const sessionUser = {
                name: result.user.name,
                email: result.user.email,
                loginTime: new Date().toISOString()
            };

            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
            } else {
                sessionStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
            }

            showToast('Welcome back, ' + result.user.name + '!', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);

        } else {
            // Fallback: check localStorage
            btn.classList.remove('loading');
            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            const user = localUsers.find(u => u.email === email.toLowerCase() && u.password === password);

            if (!user) {
                showInputError('loginPasswordError', 'Invalid email or password');
                return;
            }

            const sessionUser = { name: user.name, email: user.email, loginTime: new Date().toISOString() };
            localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
            showToast('Welcome back, ' + user.name + '!', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        }
    } catch (e) {
        btn.classList.remove('loading');
        showInputError('loginPasswordError', 'Connection failed. Try again.');
    }
}

// =============================================
// SIGNUP
// =============================================
async function handleSignup(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    let valid = true;

    if (!name) { showInputError('signupNameError', 'Name is required'); valid = false; }
    if (!email) { showInputError('signupEmailError', 'Email is required'); valid = false; }
    else if (!isValidEmail(email)) { showInputError('signupEmailError', 'Enter a valid email'); valid = false; }
    if (!password) { showInputError('signupPasswordError', 'Password is required'); valid = false; }
    else if (password.length < 6) { showInputError('signupPasswordError', 'Min 6 characters'); valid = false; }
    if (password !== confirm) { showInputError('signupConfirmError', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('signupBtn');
    btn.classList.add('loading');

    try {
        if (authState.apiAvailable) {
            // Call Apps Script API - signup + send OTP email
            const result = await callAPI('signup', { name, email, password });
            btn.classList.remove('loading');

            if (!result.success) {
                showInputError('signupEmailError', result.message || 'Signup failed');
                return;
            }

            // Save the pending email
            authState.pendingSignupEmail = email;

            document.getElementById('otpEmailDisplay').textContent = email;
            showForm('otpForm');
            startOTPTimer();
            clearOTPInputs();
            document.querySelector('.otp-digit[data-index="0"]').focus();
            showToast('OTP sent to ' + email, 'info');

        } else {
            // Fallback: save to localStorage
            btn.classList.remove('loading');

            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            if (localUsers.find(u => u.email === email.toLowerCase())) {
                showInputError('signupEmailError', 'Account already exists');
                return;
            }

            const otp = generateOTP();
            authState.pendingSignupEmail = email;

            document.getElementById('otpEmailDisplay').textContent = email;

            // Store temporarily
            localUsers.push({ name, email: email.toLowerCase(), password, status: 'pending', otp, createdAt: new Date().toISOString() });
            localStorage.setItem('sqlcode_users', JSON.stringify(localUsers));

            showForm('otpForm');
            startOTPTimer();
            clearOTPInputs();
            document.querySelector('.otp-digit[data-index="0"]').focus();
            showToast('OTP generated (demo mode)', 'info');
        }
    } catch (e) {
        btn.classList.remove('loading');
        showToast('Connection failed', 'error');
    }
}

// =============================================
// OTP VERIFICATION
// =============================================
async function handleOTPVerify(e) {
    e.preventDefault();

    const digits = document.querySelectorAll('.otp-digit');
    const code = Array.from(digits).map(d => d.value).join('');

    if (code.length !== 6) {
        document.getElementById('otpError').textContent = 'Please enter all 6 digits';
        digits.forEach(d => d.classList.add('error'));
        setTimeout(() => digits.forEach(d => d.classList.remove('error')), 400);
        return;
    }

    const btn = document.getElementById('verifyBtn');
    btn.classList.add('loading');
    const email = authState.pendingSignupEmail;

    try {
        if (authState.apiAvailable) {
            const result = await callAPI('verifyOTP', { email, otp: code });
            btn.classList.remove('loading');

            if (!result.success) {
                document.getElementById('otpError').textContent = result.message || 'Verification failed';
                digits.forEach(d => d.classList.add('error'));
                setTimeout(() => {
                    digits.forEach(d => { d.classList.remove('error'); d.value = ''; });
                    digits[0].focus();
                }, 400);
                return;
            }

            // Verified! Auto-login
            const sessionUser = { name: result.user.name, email: result.user.email, loginTime: new Date().toISOString() };
            localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
            clearInterval(authState.otpTimer);
            authState.currentOTP = null;

            document.getElementById('successTitle').textContent = 'Account Created!';
            document.getElementById('successMessage').textContent = 'Email verified. Redirecting to SQLCode...';
            showForm('successForm');
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);

        } else {
            // Fallback: verify from localStorage
            btn.classList.remove('loading');

            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            const userIdx = localUsers.findIndex(u => u.email === email.toLowerCase());

            if (userIdx < 0) { showInputError('otpError', 'User not found'); return; }
            if (localUsers[userIdx].otp !== code) {
                document.getElementById('otpError').textContent = 'Invalid code';
                digits.forEach(d => d.classList.add('error'));
                setTimeout(() => { digits.forEach(d => { d.classList.remove('error'); d.value = ''; }); digits[0].focus(); }, 400);
                return;
            }

            // Activate user
            localUsers[userIdx].status = 'active';
            delete localUsers[userIdx].otp;
            localStorage.setItem('sqlcode_users', JSON.stringify(localUsers));

            const sessionUser = { name: localUsers[userIdx].name, email: localUsers[userIdx].email, loginTime: new Date().toISOString() };
            localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
            clearInterval(authState.otpTimer);

            document.getElementById('successTitle').textContent = 'Account Created!';
            document.getElementById('successMessage').textContent = 'Redirecting to SQLCode...';
            showForm('successForm');
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        }
    } catch (e) {
        btn.classList.remove('loading');
        showToast('Connection failed', 'error');
    }
}

// =============================================
// RESEND OTP
// =============================================
async function resendOTP() {
    const email = authState.pendingSignupEmail;
    if (!email) return;

    try {
        if (authState.apiAvailable) {
            await callAPI('resendOTP', { email });
        } else {
            const otp = generateOTP();

            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            const user = localUsers.find(u => u.email === email.toLowerCase());
            if (user) { user.otp = otp; localStorage.setItem('sqlcode_users', JSON.stringify(localUsers)); }
        }
    } catch (e) { /* ignore */ }

    startOTPTimer();
    clearOTPInputs();
    document.querySelector('.otp-digit[data-index="0"]').focus();
    showToast('New code sent!', 'info');
}

// =============================================
// FORGOT PASSWORD
// =============================================
async function handleForgot(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) { showInputError('forgotEmailError', 'Email is required'); return; }
    if (!isValidEmail(email)) { showInputError('forgotEmailError', 'Enter a valid email'); return; }

    const btn = document.getElementById('forgotBtn');
    btn.classList.add('loading');

    try {
        if (authState.apiAvailable) {
            const result = await callAPI('forgotPassword', { email });
            btn.classList.remove('loading');

            if (!result.success) {
                showInputError('forgotEmailError', result.message || 'Failed');
                return;
            }

            authState.pendingSignupEmail = email;
            showForm('resetForm');
            showToast('Reset code sent to ' + email, 'info');

        } else {
            // Fallback
            btn.classList.remove('loading');
            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            const user = localUsers.find(u => u.email === email.toLowerCase());
            if (!user) { showInputError('forgotEmailError', 'No account found'); return; }

            const otp = generateOTP();
            user.otp = otp;
            localStorage.setItem('sqlcode_users', JSON.stringify(localUsers));

            authState.pendingSignupEmail = email;
            showForm('resetForm');
            showToast('Reset code generated (demo)', 'info');
        }
    } catch (e) {
        btn.classList.remove('loading');
        showToast('Connection failed', 'error');
    }
}

// =============================================
// RESET PASSWORD
// =============================================
async function handleReset(e) {
    e.preventDefault();
    clearErrors();

    const code = document.getElementById('resetCode').value.trim();
    const password = document.getElementById('resetPassword').value;
    let valid = true;

    if (!code) { showInputError('resetCodeError', 'Code is required'); valid = false; }
    if (!password) { showInputError('resetPasswordError', 'Password is required'); valid = false; }
    else if (password.length < 6) { showInputError('resetPasswordError', 'Min 6 characters'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('resetBtn');
    btn.classList.add('loading');
    const email = authState.pendingSignupEmail;

    try {
        if (authState.apiAvailable) {
            const result = await callAPI('resetPassword', { email, code, newPassword: password });
            btn.classList.remove('loading');

            if (!result.success) {
                showInputError('resetCodeError', result.message || 'Failed');
                return;
            }

            document.getElementById('successTitle').textContent = 'Password Reset!';
            document.getElementById('successMessage').textContent = 'Your password has been updated.';
            showForm('successForm');
            setTimeout(() => { showForm('loginForm'); document.getElementById('loginEmail').value = email; }, 2000);

        } else {
            // Fallback
            btn.classList.remove('loading');
            const localUsers = JSON.parse(localStorage.getItem('sqlcode_users') || '[]');
            const user = localUsers.find(u => u.email === email.toLowerCase());
            if (!user || user.otp !== code) {
                showInputError('resetCodeError', 'Invalid code');
                return;
            }
            user.password = password;
            delete user.otp;
            localStorage.setItem('sqlcode_users', JSON.stringify(localUsers));

            document.getElementById('successTitle').textContent = 'Password Reset!';
            document.getElementById('successMessage').textContent = 'Redirecting to login...';
            showForm('successForm');
            setTimeout(() => { showForm('loginForm'); document.getElementById('loginEmail').value = email; }, 2000);
        }
    } catch (e) {
        btn.classList.remove('loading');
        showToast('Connection failed', 'error');
    }
}

// =============================================
// OTP TIMER
// =============================================
function startOTPTimer() {
    let seconds = 60;
    const timerEl = document.getElementById('otpTimer');
    const resendEl = document.getElementById('resendLink');
    timerEl.classList.remove('hidden');
    resendEl.classList.add('hidden');

    clearInterval(authState.otpTimer);
    authState.otpTimer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(authState.otpTimer);
            timerEl.classList.add('hidden');
            resendEl.classList.remove('hidden');
            return;
        }
        timerEl.innerHTML = 'Resend code in <strong>' + seconds + 's</strong>';
    }, 1000);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// OTP INPUTS
// =============================================
function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-digit');
    inputs.forEach((input, i) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val;
            if (val && i < inputs.length - 1) inputs[i + 1].focus();
            input.classList.toggle('filled', !!val);
            document.getElementById('otpError').textContent = '';
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) {
                inputs[i - 1].focus();
                inputs[i - 1].value = '';
                inputs[i - 1].classList.remove('filled');
            }
            if (e.key === 'Enter') document.getElementById('otpFormElement').dispatchEvent(new Event('submit'));
        });
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            for (let j = 0; j < Math.min(paste.length, 6); j++) {
                inputs[j].value = paste[j];
                inputs[j].classList.add('filled');
            }
            inputs[Math.min(paste.length, 5)].focus();
        });
    });
}

function clearOTPInputs() {
    document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; d.classList.remove('filled', 'error'); });
    document.getElementById('otpError').textContent = '';
}

// =============================================
// PASSWORD STRENGTH
// =============================================
function setupPasswordStrength() {
    const input = document.getElementById('signupPassword');
    const container = document.getElementById('passwordStrength');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    input.addEventListener('input', () => {
        if (!input.value) { container.classList.remove('visible'); return; }
        container.classList.add('visible');
        let s = 0;
        if (input.value.length >= 6) s++;
        if (input.value.length >= 10) s++;
        if (/[A-Z]/.test(input.value)) s++;
        if (/[0-9]/.test(input.value)) s++;
        if (/[^A-Za-z0-9]/.test(input.value)) s++;

        if (s < 2) { fill.style.width = '33%'; fill.style.background = 'var(--red)'; text.textContent = 'Weak'; text.style.color = 'var(--red)'; }
        else if (s < 4) { fill.style.width = '66%'; fill.style.background = 'var(--yellow)'; text.textContent = 'Fair'; text.style.color = 'var(--yellow)'; }
        else { fill.style.width = '100%'; fill.style.background = 'var(--green)'; text.textContent = 'Strong'; text.style.color = 'var(--green)'; }
    });
}

// =============================================
// TOGGLE PASSWORD
// =============================================
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
}

// =============================================
// SOCIAL LOGIN
// =============================================
function socialLogin(provider) {
    showToast(provider + ' login coming soon — use email/password', 'info');
}

// =============================================
// FLOATING CODE ANIMATION
// =============================================
function createFloatingCode() {
    const container = document.getElementById('floatingCode');
    const snippets = [
        'SELECT * FROM users;', 'JOIN orders ON users.id = orders.user_id',
        'WHERE salary > 50000', 'GROUP BY department', 'ORDER BY created_at DESC',
        'INSERT INTO logs VALUES(...)', 'DELETE FROM sessions WHERE expire < NOW()',
        'UPDATE accounts SET balance = balance - 100', 'WITH cte AS (SELECT * FROM data)',
        'RANK() OVER (PARTITION BY dept)', 'CREATE INDEX idx_email ON users(email)',
        'HAVING COUNT(*) > 5', 'INNER JOIN products ON p.id = o.product_id',
    ];
    for (let i = 0; i < 12; i++) {
        const line = document.createElement('div');
        line.className = 'code-line';
        line.textContent = snippets[i % snippets.length];
        line.style.top = (Math.random() * 100) + '%';
        line.style.animationDuration = (25 + Math.random() * 30) + 's';
        line.style.animationDelay = -(Math.random() * 30) + 's';
        line.style.fontSize = (11 + Math.random() * 2) + 'px';
        container.appendChild(line);
    }
}

// =============================================
// UTILITIES
// =============================================
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function showInputError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearErrors() { document.querySelectorAll('.input-error').forEach(e => e.textContent = ''); document.querySelectorAll('.otp-digit').forEach(d => d.classList.remove('error')); }

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// =============================================
// EVENT BINDINGS
// =============================================
function bindAuthEvents() {
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('otpFormElement').addEventListener('submit', handleOTPVerify);
    document.getElementById('forgotFormElement').addEventListener('submit', handleForgot);
    document.getElementById('resetFormElement').addEventListener('submit', handleReset);

    document.querySelectorAll('.auth-form input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { const form = input.closest('form'); if (form) form.dispatchEvent(new Event('submit')); }
        });
    });
}
