/* =============================================
   SQLCode Auth - Login / Signup / OTP / Forgot Password
   ============================================= */

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj7TscCCsJ0tZpkA-dvlR5zppxgM6U8AQbmWLlua8BksTws9_b0lI9PXGTdhQ9IuFBQ6guNWukPqA2/pub?output=csv';

// =============================================
// STATE
// =============================================
const authState = {
    currentUser: JSON.parse(localStorage.getItem('sqlcode_user') || 'null'),
    sheetUsers: [],       // users loaded from Google Sheet
    localUsers: JSON.parse(localStorage.getItem('sqlcode_users') || '[]'),
    pendingSignup: null,   // user being signed up (before OTP)
    pendingReset: null,    // user resetting password
    currentOTP: null,
    otpTimer: null,
    otpExpiry: null,
};

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    // If already logged in, redirect
    if (authState.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    await loadSheetUsers();
    createFloatingCode();
    bindAuthEvents();
    setupOTPInputs();
    setupPasswordStrength();
});

// =============================================
// GOOGLE SHEETS INTEGRATION
// =============================================
async function loadSheetUsers() {
    try {
        const resp = await fetch(SHEET_CSV_URL);
        const text = await resp.text();
        if (!text.trim()) return;

        const lines = text.trim().split('\n');
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
        authState.sheetUsers = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const user = {};
            headers.forEach((h, idx) => {
                user[h] = (values[idx] || '').trim().replace(/"/g, '');
            });
            if (user.email || user.name) {
                authState.sheetUsers.push({
                    name: user.name || user.username || '',
                    email: (user.email || '').toLowerCase(),
                    password: user.password || '',
                    verified: true,
                    source: 'sheet'
                });
            }
        }
        console.log(`Loaded ${authState.sheetUsers.length} users from Google Sheet`);
    } catch (e) {
        console.log('Google Sheet not available, using local storage');
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
        else { current += ch; }
    }
    result.push(current);
    return result;
}

function getAllUsers() {
    return [...authState.sheetUsers, ...authState.localUsers];
}

function findUser(email) {
    return getAllUsers().find(u => u.email === email.toLowerCase());
}

function saveLocalUser(user) {
    authState.localUsers.push(user);
    localStorage.setItem('sqlcode_users', JSON.stringify(authState.localUsers));
}

function updateLocalUser(email, updates) {
    const idx = authState.localUsers.findIndex(u => u.email === email.toLowerCase());
    if (idx >= 0) {
        authState.localUsers[idx] = { ...authState.localUsers[idx], ...updates };
        localStorage.setItem('sqlcode_users', JSON.stringify(authState.localUsers));
    }
}

// =============================================
// FORM NAVIGATION
// =============================================
function showForm(formId) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove('hidden');
        // Re-trigger animation
        form.style.animation = 'none';
        form.offsetHeight; // reflow
        form.style.animation = '';
    }
}

// =============================================
// LOGIN
// =============================================
function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;

    if (!email) {
        showInputError('loginEmailError', 'Email is required');
        valid = false;
    } else if (!isValidEmail(email)) {
        showInputError('loginEmailError', 'Enter a valid email address');
        valid = false;
    }

    if (!password) {
        showInputError('loginPasswordError', 'Password is required');
        valid = false;
    }

    if (!valid) return;

    const btn = document.getElementById('loginBtn');
    btn.classList.add('loading');

    setTimeout(() => {
        const user = findUser(email);

        if (!user) {
            btn.classList.remove('loading');
            showInputError('loginEmailError', 'No account found with this email');
            return;
        }

        if (user.password && user.password !== password) {
            btn.classList.remove('loading');
            showInputError('loginPasswordError', 'Incorrect password');
            return;
        }

        // Login successful
        const sessionUser = {
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
        } else {
            sessionStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));
        }

        authState.currentUser = sessionUser;
        showToast('Welcome back, ' + (user.name || 'User') + '!', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }, 600);
}

// =============================================
// SIGNUP + OTP
// =============================================
function handleSignup(e) {
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
    if (findUser(email)) { showInputError('signupEmailError', 'An account already exists'); valid = false; }

    if (!valid) return;

    const btn = document.getElementById('signupBtn');
    btn.classList.add('loading');

    setTimeout(() => {
        btn.classList.remove('loading');

        // Store pending user and generate OTP
        authState.pendingSignup = { name, email, password };
        authState.currentOTP = generateOTP();

        document.getElementById('otpEmailDisplay').textContent = email;
        document.getElementById('otpCodeDisplay').textContent = authState.currentOTP;

        showForm('otpForm');
        startOTPTimer();
        clearOTPInputs();

        // Focus first OTP input
        document.querySelector('.otp-digit[data-index="0"]').focus();

        showToast('Verification code sent!', 'info');
    }, 500);
}

// =============================================
// OTP VERIFICATION
// =============================================
function handleOTPVerify(e) {
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

    setTimeout(() => {
        btn.classList.remove('loading');

        if (code !== authState.currentOTP) {
            document.getElementById('otpError').textContent = 'Invalid code. Try again.';
            digits.forEach(d => d.classList.add('error'));
            setTimeout(() => {
                digits.forEach(d => { d.classList.remove('error'); d.value = ''; });
                digits[0].focus();
            }, 400);
            return;
        }

        // OTP verified - create account
        const user = authState.pendingSignup;
        saveLocalUser({
            name: user.name,
            email: user.email.toLowerCase(),
            password: user.password,
            verified: true,
            createdAt: new Date().toISOString()
        });

        // Auto login
        const sessionUser = {
            name: user.name,
            email: user.email.toLowerCase(),
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('sqlcode_user', JSON.stringify(sessionUser));

        clearInterval(authState.otpTimer);
        authState.pendingSignup = null;
        authState.currentOTP = null;

        document.getElementById('successTitle').textContent = 'Account Created!';
        document.getElementById('successMessage').textContent = 'Your email has been verified. Redirecting to SQLCode...';
        showForm('successForm');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 600);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function startOTPTimer() {
    let seconds = 60;
    authState.otpExpiry = Date.now() + 60000;
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
        timerEl.innerHTML = `Resend code in <strong>${seconds}s</strong>`;
    }, 1000);
}

function resendOTP() {
    authState.currentOTP = generateOTP();
    document.getElementById('otpCodeDisplay').textContent = authState.currentOTP;
    startOTPTimer();
    clearOTPInputs();
    document.querySelector('.otp-digit[data-index="0"]').focus();
    showToast('New code sent!', 'info');
}

// =============================================
// FORGOT PASSWORD
// =============================================
function handleForgot(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('forgotEmail').value.trim();

    if (!email) { showInputError('forgotEmailError', 'Email is required'); return; }
    if (!isValidEmail(email)) { showInputError('forgotEmailError', 'Enter a valid email'); return; }

    const user = findUser(email);
    if (!user) { showInputError('forgotEmailError', 'No account found with this email'); return; }

    const btn = document.getElementById('forgotBtn');
    btn.classList.add('loading');

    setTimeout(() => {
        btn.classList.remove('loading');

        authState.pendingReset = { email: email.toLowerCase() };
        authState.currentOTP = generateOTP();

        document.getElementById('resetCodeDisplay').textContent = authState.currentOTP;
        showForm('resetForm');
        showToast('Reset code sent to ' + email, 'info');
    }, 600);
}

// =============================================
// RESET PASSWORD
// =============================================
function handleReset(e) {
    e.preventDefault();
    clearErrors();

    const code = document.getElementById('resetCode').value.trim();
    const password = document.getElementById('resetPassword').value;
    let valid = true;

    if (!code) { showInputError('resetCodeError', 'Code is required'); valid = false; }
    else if (code !== authState.currentOTP) { showInputError('resetCodeError', 'Invalid code'); valid = false; }
    if (!password) { showInputError('resetPasswordError', 'Password is required'); valid = false; }
    else if (password.length < 6) { showInputError('resetPasswordError', 'Min 6 characters'); valid = false; }

    if (!valid) return;

    const btn = document.getElementById('resetBtn');
    btn.classList.add('loading');

    setTimeout(() => {
        btn.classList.remove('loading');

        // Update password
        const email = authState.pendingReset.email;
        const existing = authState.localUsers.find(u => u.email === email);
        if (existing) {
            updateLocalUser(email, { password });
        } else {
            saveLocalUser({ name: '', email, password, verified: true, createdAt: new Date().toISOString() });
        }

        authState.pendingReset = null;
        authState.currentOTP = null;

        document.getElementById('successTitle').textContent = 'Password Reset!';
        document.getElementById('successMessage').textContent = 'Your password has been updated. Redirecting...';
        showForm('successForm');

        setTimeout(() => {
            showForm('loginForm');
            document.getElementById('loginEmail').value = email;
        }, 2000);
    }, 600);
}

// =============================================
// OTP INPUTS HANDLING
// =============================================
function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-digit');

    inputs.forEach((input, i) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val;

            if (val && i < inputs.length - 1) {
                inputs[i + 1].focus();
            }

            if (val) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }

            // Clear error
            document.getElementById('otpError').textContent = '';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) {
                inputs[i - 1].focus();
                inputs[i - 1].value = '';
                inputs[i - 1].classList.remove('filled');
            }
            if (e.key === 'Enter') {
                document.getElementById('otpFormElement').dispatchEvent(new Event('submit'));
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            for (let j = 0; j < Math.min(paste.length, 6); j++) {
                inputs[j].value = paste[j];
                inputs[j].classList.add('filled');
            }
            if (paste.length >= 6) {
                inputs[5].focus();
            } else {
                inputs[Math.min(paste.length, 5)].focus();
            }
        });
    });
}

function clearOTPInputs() {
    document.querySelectorAll('.otp-digit').forEach(d => {
        d.value = '';
        d.classList.remove('filled', 'error');
    });
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
        const val = input.value;
        if (!val) {
            container.classList.remove('visible');
            return;
        }

        container.classList.add('visible');
        const strength = calcStrength(val);

        if (strength < 2) {
            fill.style.width = '33%';
            fill.style.background = 'var(--red)';
            text.textContent = 'Weak';
            text.style.color = 'var(--red)';
        } else if (strength < 4) {
            fill.style.width = '66%';
            fill.style.background = 'var(--yellow)';
            text.textContent = 'Fair';
            text.style.color = 'var(--yellow)';
        } else {
            fill.style.width = '100%';
            fill.style.background = 'var(--green)';
            text.textContent = 'Strong';
            text.style.color = 'var(--green)';
        }
    });
}

function calcStrength(pw) {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}

// =============================================
// SOCIAL LOGIN (simulated)
// =============================================
function socialLogin(provider) {
    showToast(`${provider} login is demo only — use email/password`, 'info');
}

// =============================================
// TOGGLE PASSWORD VISIBILITY
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
// EVENT BINDINGS
// =============================================
function bindAuthEvents() {
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('otpFormElement').addEventListener('submit', handleOTPVerify);
    document.getElementById('forgotFormElement').addEventListener('submit', handleForgot);
    document.getElementById('resetFormElement').addEventListener('submit', handleReset);

    // Enter key on inputs
    document.querySelectorAll('.auth-form input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const form = input.closest('form');
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    });
}

// =============================================
// FLOATING CODE ANIMATION
// =============================================
function createFloatingCode() {
    const container = document.getElementById('floatingCode');
    const snippets = [
        'SELECT * FROM users;',
        'JOIN orders ON users.id = orders.user_id',
        'WHERE salary > 50000',
        'GROUP BY department',
        'ORDER BY created_at DESC',
        'INSERT INTO logs VALUES(...)',
        'DELETE FROM sessions WHERE expire < NOW()',
        'UPDATE accounts SET balance = balance - 100',
        'WITH cte AS (SELECT * FROM data)',
        'RANK() OVER (PARTITION BY dept)',
        'CREATE INDEX idx_email ON users(email)',
        'HAVING COUNT(*) > 5',
        'INNER JOIN products ON p.id = o.product_id',
        'CASE WHEN status = 1 THEN "Active"',
        'COALESCE(name, "Unknown")',
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
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showInputError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.otp-digit').forEach(d => d.classList.remove('error'));
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
