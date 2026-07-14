/*
 * =============================================
 * SQLCode - Google Apps Script Backend
 * =============================================
 * 
 * DEPLOYMENT STEPS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save (Ctrl+S)
 * 5. Click "Deploy" → "New deployment"
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy → Copy the Web App URL
 * 10. Paste that URL in auth.js where it says SCRIPT_URL
 *
 * SHEET COLUMNS (set up in your Google Sheet):
 * A: Name
 * B: Email
 * C: Password
 * D: OTP
 * E: OTP_Expiry
 * F: Status (active/pending)
 * G: Created_At
 * H: Reset_Token
 */

// =============================================
// CONFIGURATION
// =============================================
const SHEET_NAME = 'Users'; // Name of the sheet tab
const OTP_EXPIRY_MINUTES = 5;
const APP_NAME = 'SQLCode';

// =============================================
// WEB APP ENTRY POINTS
// =============================================

/**
 * Handle GET requests — JSONP-style for frontend callers
 * 
 * All API calls come through here via query params:
 *   ?action=signup&name=...&email=...&password=...
 *   ?action=login&email=...&password=...
 *   ?action=verifyOTP&email=...&otp=...
 *   etc.
 *
 * If &callback=myFunc is present, response is wrapped as:
 *   myFunc({"success":true,...})
 * with MIME type text/javascript so a <script> tag can execute it.
 *
 * Without &callback, response is plain JSON.
 */
function doGet(e) {
  var params = e.parameter;
  var action  = params.action || '';
  var callback = params.callback || '';

  var result;
  switch (action) {
    case 'signup':         result = handleSignup(params);        break;
    case 'login':          result = handleLogin(params);         break;
    case 'verifyOTP':      result = handleVerifyOTP(params);     break;
    case 'resendOTP':      result = handleResendOTP(params);     break;
    case 'forgotPassword': result = handleForgotPassword(params);break;
    case 'resetPassword':  result = handleResetPassword(params); break;
    case 'checkEmail':     result = handleCheckEmail(params);    break;
    case 'saveSubmission': result = handleSaveSubmission(params); break;
    case 'getSubmissions': result = handleGetSubmissions(params); break;
    default:
      result = jsonResponse({ status: 'ok', message: 'SQLCode Backend is running' });
  }

  // Extract the JSON string from the TextOutput object
  var jsonString = result.getContent();

  // Wrap in JSONP callback if one was provided
  if (callback) {
    // Validate callback name (alphanumeric + dots/underscores only)
    if (!/^[a-zA-Z0-9_.]+$/.test(callback)) {
      callback = 'callback';
    }
    var jsonp = callback + '(' + jsonString + ')';
    return ContentService.createTextOutput(jsonp)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests (all API calls)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'signup':
        return handleSignup(data);
      case 'login':
        return handleLogin(data);
      case 'verifyOTP':
        return handleVerifyOTP(data);
      case 'resendOTP':
        return handleResendOTP(data);
      case 'forgotPassword':
        return handleForgotPassword(data);
      case 'resetPassword':
        return handleResetPassword(data);
      case 'checkEmail':
        return handleCheckEmail(data);
      case 'saveSubmission':
        return handleSaveSubmission(data);
      case 'getSubmissions':
        return handleGetSubmissions(data);
      default:
        return jsonResponse({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
}

// =============================================
// HELPER: Get Sheet
// =============================================
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Name', 'Email', 'Password', 'OTP', 'OTP_Expiry', 
      'Status', 'Created_At', 'Reset_Token'
    ]);
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('#FFFFFF');
    sheet.setColumnWidths(1, 8, 150);
  }
  
  return sheet;
}

// =============================================
// HELPER: Find User by Email
// =============================================
function findUserByEmail(email) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const normalizedEmail = email.toLowerCase().trim();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase().trim() === normalizedEmail) {
      return {
        row: i + 1, // 1-indexed row number
        name: data[i][0],
        email: data[i][1],
        password: data[i][2],
        otp: data[i][3],
        otpExpiry: data[i][4],
        status: data[i][5],
        createdAt: data[i][6],
        resetToken: data[i][7]
      };
    }
  }
  return null;
}

// =============================================
// HELPER: Generate OTP
// =============================================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// HELPER: JSON Response
// =============================================
function jsonResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify(data)
  ).setMimeType(ContentService.MimeType.JSON);
}

// =============================================
// HELPER: Send Email
// =============================================
function sendEmail(to, subject, body) {
  GmailApp.sendEmail(to, subject, body, {
    name: APP_NAME,
    noReply: true
  });
}

// =============================================
// ACTION: SIGNUP
// =============================================
function handleSignup(data) {
  const { name, email, password } = data;
  
  if (!name || !email || !password) {
    return jsonResponse({ 
      success: false, 
      message: 'Name, email and password are required' 
    });
  }
  
  // Check if user already exists
  const existing = findUserByEmail(email);
  if (existing) {
    return jsonResponse({ 
      success: false, 
      message: 'An account already exists with this email' 
    });
  }
  
  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();
  
  // Save user to sheet
  const sheet = getSheet();
  sheet.appendRow([
    name,
    email.toLowerCase().trim(),
    password, // In production, hash this!
    otp,
    otpExpiry,
    'pending',
    new Date().toISOString(),
    ''
  ]);
  
  // Send OTP email
  try {
    sendEmail(
      email,
      APP_NAME + ' - Verify your email',
      'Hi ' + name + ',\n\n' +
      'Your verification code is: ' + otp + '\n\n' +
      'This code expires in ' + OTP_EXPIRY_MINUTES + ' minutes.\n\n' +
      'If you did not create this account, please ignore this email.\n\n' +
      ' Regards,\n' + APP_NAME + ' Team'
    );
  } catch (e) {
    Logger.log('Email send failed: ' + e.message);
    // Continue anyway - user can still verify with demo code
  }
  
  return jsonResponse({ 
    success: true, 
    message: 'OTP sent to your email',
    email: email
  });
}

// =============================================
// ACTION: VERIFY OTP
// =============================================
function handleVerifyOTP(data) {
  const { email, otp } = data;
  
  if (!email || !otp) {
    return jsonResponse({ 
      success: false, 
      message: 'Email and OTP are required' 
    });
  }
  
  const user = findUserByEmail(email);
  if (!user) {
    return jsonResponse({ 
      success: false, 
      message: 'User not found' 
    });
  }
  
  if (user.status === 'active') {
    return jsonResponse({ 
      success: false, 
      message: 'Account is already verified' 
    });
  }
  
  // Check OTP expiry
  if (new Date(user.otpExpiry) < new Date()) {
    return jsonResponse({ 
      success: false, 
      message: 'OTP has expired. Please request a new one.' 
    });
  }
  
  // Verify OTP
  if (user.otp.toString() !== otp.toString()) {
    return jsonResponse({ 
      success: false, 
      message: 'Invalid OTP code' 
    });
  }
  
  // Activate user
  const sheet = getSheet();
  sheet.getRange(user.row, 6).setValue('active'); // Status
  sheet.getRange(user.row, 4).setValue(''); // Clear OTP
  sheet.getRange(user.row, 5).setValue(''); // Clear OTP expiry
  
  return jsonResponse({ 
    success: true, 
    message: 'Email verified successfully',
    user: { name: user.name, email: user.email }
  });
}

// =============================================
// ACTION: RESEND OTP
// =============================================
function handleResendOTP(data) {
  const { email } = data;
  
  if (!email) {
    return jsonResponse({ 
      success: false, 
      message: 'Email is required' 
    });
  }
  
  const user = findUserByEmail(email);
  if (!user) {
    return jsonResponse({ 
      success: false, 
      message: 'User not found' 
    });
  }
  
  if (user.status === 'active') {
    return jsonResponse({ 
      success: false, 
      message: 'Account is already verified' 
    });
  }
  
  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();
  
  // Update in sheet
  const sheet = getSheet();
  sheet.getRange(user.row, 4).setValue(otp); // OTP
  sheet.getRange(user.row, 5).setValue(otpExpiry); // OTP Expiry
  
  // Send email
  try {
    sendEmail(
      email,
      APP_NAME + ' - Your new verification code',
      'Hi ' + user.name + ',\n\n' +
      'Your new verification code is: ' + otp + '\n\n' +
      'This code expires in ' + OTP_EXPIRY_MINUTES + ' minutes.\n\n' +
      'Regards,\n' + APP_NAME + ' Team'
    );
  } catch (e) {
    Logger.log('Email send failed: ' + e.message);
  }
  
  return jsonResponse({ 
    success: true, 
    message: 'New OTP sent'
  });
}

// =============================================
// ACTION: LOGIN
// =============================================
function handleLogin(data) {
  const { email, password } = data;
  
  if (!email || !password) {
    return jsonResponse({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  const user = findUserByEmail(email);
  
  if (!user) {
    return jsonResponse({ 
      success: false, 
      message: 'No account found with this email' 
    });
  }
  
  if (user.status !== 'active') {
    return jsonResponse({ 
      success: false, 
      message: 'Please verify your email first',
      needsVerification: true
    });
  }
  
  if (user.password !== password) {
    return jsonResponse({ 
      success: false, 
      message: 'Incorrect password' 
    });
  }
  
  return jsonResponse({ 
    success: true, 
    message: 'Login successful',
    user: { name: user.name, email: user.email }
  });
}

// =============================================
// ACTION: FORGOT PASSWORD
// =============================================
function handleForgotPassword(data) {
  const { email } = data;
  
  if (!email) {
    return jsonResponse({ 
      success: false, 
      message: 'Email is required' 
    });
  }
  
  const user = findUserByEmail(email);
  if (!user) {
    return jsonResponse({ 
      success: false, 
      message: 'No account found with this email' 
    });
  }
  
  // Generate reset token (OTP-based)
  const resetToken = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();
  
  // Update in sheet
  const sheet = getSheet();
  sheet.getRange(user.row, 4).setValue(resetToken); // Reuse OTP column
  sheet.getRange(user.row, 5).setValue(otpExpiry);
  sheet.getRange(user.row, 8).setValue(resetToken); // Reset token
  
  // Send email
  try {
    sendEmail(
      email,
      APP_NAME + ' - Password Reset Code',
      'Hi ' + (user.name || 'User') + ',\n\n' +
      'Your password reset code is: ' + resetToken + '\n\n' +
      'This code expires in ' + OTP_EXPIRY_MINUTES + ' minutes.\n\n' +
      'If you did not request this, please ignore this email.\n\n' +
      'Regards,\n' + APP_NAME + ' Team'
    );
  } catch (e) {
    Logger.log('Email send failed: ' + e.message);
  }
  
  return jsonResponse({ 
    success: true, 
    message: 'Reset code sent to your email'
  });
}

// =============================================
// ACTION: RESET PASSWORD
// =============================================
function handleResetPassword(data) {
  const { email, code, newPassword } = data;
  
  if (!email || !code || !newPassword) {
    return jsonResponse({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  const user = findUserByEmail(email);
  if (!user) {
    return jsonResponse({ 
      success: false, 
      message: 'User not found' 
    });
  }
  
  // Verify the reset code
  if (user.otp.toString() !== code.toString()) {
    return jsonResponse({ 
      success: false, 
      message: 'Invalid reset code' 
    });
  }
  
  // Check expiry
  if (new Date(user.otpExpiry) < new Date()) {
    return jsonResponse({ 
      success: false, 
      message: 'Reset code has expired' 
    });
  }
  
  // Update password
  const sheet = getSheet();
  sheet.getRange(user.row, 3).setValue(newPassword); // New password
  sheet.getRange(user.row, 4).setValue(''); // Clear OTP
  sheet.getRange(user.row, 5).setValue(''); // Clear expiry
  sheet.getRange(user.row, 8).setValue(''); // Clear reset token
  
  return jsonResponse({ 
    success: true, 
    message: 'Password reset successfully' 
  });
}

// =============================================
// ACTION: CHECK EMAIL EXISTS
// =============================================
function handleCheckEmail(data) {
  const { email } = data;
  const user = findUserByEmail(email);
  
  return jsonResponse({ 
    success: true, 
    exists: !!user,
    verified: user ? user.status === 'active' : false
  });
}

// =============================================
// HELPER: Get Submissions Sheet
// =============================================
function getSubmissionsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Submissions');
  
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    sheet.appendRow([
      'Email', 'Problem_ID', 'Status', 'Query', 'Runtime', 'Submitted_At'
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#34A853');
    headerRange.setFontColor('#FFFFFF');
    sheet.setColumnWidths(1, 6, 150);
  }
  
  return sheet;
}

// =============================================
// ACTION: SAVE SUBMISSION
// =============================================
function handleSaveSubmission(data) {
  var email = data.email;
  var problemId = data.problemId;
  var status = data.status; // 'accepted' or 'wrong'
  var query = data.query || '';
  var runtime = data.runtime || '';
  
  if (!email || !problemId) {
    return jsonResponse({ 
      success: false, 
      message: 'Email and problemId are required' 
    });
  }
  
  var sheet = getSubmissionsSheet();
  sheet.appendRow([
    email.toLowerCase().trim(),
    parseInt(problemId),
    status,
    query,
    runtime,
    new Date().toISOString()
  ]);
  
  return jsonResponse({ 
    success: true, 
    message: 'Submission saved' 
  });
}

// =============================================
// ACTION: GET SUBMISSIONS
// =============================================
function handleGetSubmissions(data) {
  var email = data.email;
  
  if (!email) {
    return jsonResponse({ 
      success: false, 
      message: 'Email is required' 
    });
  }
  
  var sheet = getSubmissionsSheet();
  var allData = sheet.getDataRange().getValues();
  var normalizedEmail = email.toLowerCase().trim();
  var submissions = [];
  var solved = {};
  
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] && allData[i][0].toString().toLowerCase().trim() === normalizedEmail) {
      submissions.push({
        problemId: allData[i][1],
        status: allData[i][2],
        query: allData[i][3],
        runtime: allData[i][4],
        date: allData[i][5]
      });
      
      // Track solved problems
      if (allData[i][2] === 'accepted') {
        solved[allData[i][1]] = true;
      }
    }
  }
  
  return jsonResponse({ 
    success: true, 
    submissions: submissions,
    solvedProblems: solved
  });
}
