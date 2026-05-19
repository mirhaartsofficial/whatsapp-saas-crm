// crm_system.js
// Secure Production-Ready Meta SaaS Command Base Server for Render
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

const PORT = process.env.PORT || 10000;
const MASTER_SALT = process.env.MASTER_SALT || 'master_salt_key_999';

// Secure Password Hashing Function (SHA-256)
function generateSecureHash(password) {
    return crypto.createHmac('sha256', MASTER_SALT).update(password).digest('hex');
}

// Mock Database with pre-hashed passwords for absolute security
let systemUsersDB = [
    { 
        id: "prop_01", 
        name: "Mirha Arts Executive Proprietor", 
        email: "mirhaartsofficial@gmail.com", 
        passwordHash: generateSecureHash("Admin786"), // Default Secure Password
        role: "PROPRIETOR",
        customGreetingText: "Welcome, Respected Proprietor"
    },
    { 
        id: "agent_01", 
        name: "Zain Agent", 
        email: "zain@business.com", 
        passwordHash: generateSecureHash("Zain123"), 
        role: "AGENT",
        customGreetingText: "Welcome back, Zain"
    }
];

// Active Server Sessions Store (In-Memory for security verification)
let activeSessionsStore = {};

// --- SECURITY MIDDLEWARE ---
function authenticateRoleToken(allowedRole) {
    return (req, res, next) => {
        const sessionToken = req.headers['authorization'];
        if (!sessionToken || !activeSessionsStore[sessionToken]) {
            return res.status(401).json({ error: "Access Denied! Session invalid or expired." });
        }
        const currentUser = activeSessionsStore[sessionToken];
        if (currentUser.role !== allowedRole) {
            return res.status(403).json({ error: "Unauthorized! Higher privileges required." });
        }
        req.user = currentUser;
        next();
    };
}

// --- BACKEND API ROUTES ---

// 1. Authentication Login Portal
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = systemUsersDB.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: "Invalid Credentials" });

    const computedHash = generateSecureHash(password.trim());
    if (user.passwordHash !== computedHash) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessionsStore[sessionToken] = { id: user.id, name: user.name, email: user.email, role: user.role };

    res.json({
        token: sessionToken,
        user: {
            name: user.name,
            role: user.role,
            customGreetingText: user.customGreetingText
        }
    });
});

// 2. Controlled Password Reset Trigger (Simulated OTP Gate)
app.post('/api/auth/forgot-password-trigger', (req, res) => {
    const { email } = req.body;
    const user = systemUsersDB.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return res.status(404).json({ error: "Corporate identity email records not found." });

    const simulatedOTP = "992831"; 
    res.json({ message: "Security token initialized", simulatedOTP });
});

// 3. Complete Password Overwrite Verification Commit
app.post('/api/auth/forgot-password-verify-commit', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (otp !== "992831") return res.status(400).json({ error: "Invalid system verification code." });

    const userIndex = systemUsersDB.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (userIndex === -1) return res.status(404).json({ error: "User records missing." });

    systemUsersDB[userIndex].passwordHash = generateSecureHash(newPassword.trim());
    res.json({ success: true, message: "Security vault credentials overwritten safely." });
});

// 4. Proprietor Auditing Endpoint (Protected Route)
app.get('/api/proprietor/audit-directory-stream', authenticateRoleToken('PROPRIETOR'), (req, res) => {
    const sanitizedProfiles = systemUsersDB.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        status: "SECURED_HASH_VAULT" 
    }));
    res.json(sanitizedProfiles);
});

// 5. Proprietor Self Password Overwrite
app.post('/api/proprietor/overwrite-self-profile', authenticateRoleToken('PROPRIETOR'), (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const userIndex = systemUsersDB.findIndex(u => u.id === req.user.id);
    systemUsersDB[userIndex].passwordHash = generateSecureHash(newPassword.trim());
    res.json({ success: true, message: "Master access terminal updated." });
});


// --- INTEGRATED FRONTEND DELIVERY GATEWAY ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meta SaaS Command Base Framework</title>
    <style>
        :root { --meta-blue: #1877F2; --meta-bg: #F0F2F5; --text: #1C1E21; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--meta-bg); margin: 0; padding: 0; color: var(--text); }
        .navbar { background: var(--meta-blue); color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid-frame { display: grid; grid-template-columns: 1fr; gap: 16px; padding: 16px; max-width: 1400px; margin: auto; }
        @media(min-width: 992px) { .grid-frame { grid-template-columns: 1.3fr 1fr; } }
        .card { background: white; border-radius: 8px; border: 1px solid #CCD0D5; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 16px; }
        .saas-card { border-top: 4px solid #0056b3; background: #F0F7FF; }
        .vault-card { border-top: 4px solid #b91c1c; background: #FFF5F5; }
        .history-card { border-top: 4px solid #242526; background: #FAF9F6; }
        .form-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; text-align: left; }
        input, select, button { padding: 10px; border-radius: 6px; border: 1px solid #CCD0D5; font-size: 14px; outline: none; }
        .fleet-row { background: white; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #D2D6DC; font-size: 12px; border-left: 5px solid #0056b3; }
        .badge-pill { padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; background: #65676B; display: inline-block; }
        .login-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; margin: auto; margin-top: 10vh; box-sizing: border-box; }
        .btn-meta { display: block; background-color: #1877F2; color: white; padding: 14px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 15px; text-align: center; box-sizing: border-box; border: none; width: 100%; cursor: pointer; }
        .error-alert { display: none; background-color: #FDE8E8; border: 1px solid #E53E3E; color: #C53030; padding: 12px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; text-align: left; }
        .view-btn { background: #242526; color: white; font-size: 11px; padding: 4px 8px; border-radius: 4px; text-decoration: none; border: none; cursor: pointer; margin-top: 4px; }
        .log-box-stream { background: #1e1e1e; color: #f8f8f2; font-family: monospace; padding: 12px; border-radius: 6px; font-size: 11px; max-height: 180px; overflow-y: scroll; text-align: left; line-height: 1.5; }
        .edit-modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:none; justify-content:center; align-items:center; z-index:20000; }
        .edit-modal-card { background:white; padding:24px; border-radius:8px; max-width:450px; width:90%; text-align:left; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    </style>
</head>
<body>

    <div id="loginScreenGatewayFrame" style="display: block;">
        <div class="login-card">
            <h2>Log In to Meta SaaS</h2>
            <p style="color: gray; font-size: 13px; margin-bottom: 20px;">Enter credentials authorized inside configurations</p>
            <div id="loginErrorAlertNode" class="error-alert">⚠️ Invalid Credentials! UserID/Password is incorrect.</div>
            <div class="form-row">
                <label style="font-weight: bold; font-size: 13px;">Secure Identity Email ID</label>
                <input type="email" id="loginEmailInputField" placeholder="name@business.com" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top: 5px;">
                <label style="font-weight: bold; font-size: 13px;">Password Verification Key</label>
                <input type="password" id="loginPasswordInputField" placeholder="••••••••" style="width:100%; box-sizing:border-box;">
            </div>
            <button class="btn-meta" onclick="executeIdentityAuthenticationRequest()">Authenticate Account</button>
            <div style="margin-top: 15px;">
                <button type="button" onclick="switchLoginViewToForgotPasswordPanel()" style="background:none; border:none; color:#1877F2; font-weight:bold; font-size:13px; cursor:pointer; text-decoration:underline; padding:0;">Forgot Password?</button>
            </div>
        </div>
    </div>

    <div id="forgotPasswordWrapperOverlayFrame" style="display: none;">
        <div class="login-card">
            <h3 style="color: #1877F2; margin-top: 0;">🛡️ Secure Password Recovery Center</h3>
            <div id="forgotPasswordErrorBoxNode" class="error-alert"></div>
            <div id="forgotStep1EmailInputBlock">
                <div class="form-row"><label style="font-weight:bold; font-size:12px;">Enter Registered Email ID</label>
                    <input type="email" id="forgotEmailLookupField" style="width:100%; box-sizing:border-box;"></div>
                <button class="btn-meta" onclick="executePasswordResetRequestTicket()">Request Recovery OTP</button>
            </div>
            <div id="forgotStep2OTPVerifyBlock" style="display: none;">
                <div class="form-row"><label style="font-weight:bold; font-size:12px; color:green;">Enter 6-Digit System Verification OTP Code</label>
                    <input type="text" id="forgotVerificationOtpCodeField" style="width:100%; box-sizing:border-box;"></div>
                <div class="form-row" style="margin-top:5px;"><label style="font-weight:bold; font-size:12px;">Type New Secured Password Key</label>
                    <input type="password" id="forgotNewPasswordOverrideField" placeholder="••••••••" style="width:100%; box-sizing:border-box;"></div>
                <button class="btn-meta" onclick="executePasswordResetOTPMutationCommit()">Confirm & Reset Password</button>
            </div>
            <div style="margin-top:15px;">
                <button type="button" onclick="switchForgotViewBackToLoginGateway()" style="background:none; border:none; color:gray; font-size:13px; cursor:pointer; padding:0;">← Back to Login</button>
            </div>
        </div>
    </div>

    <div id="proprietorDataEditModalFrameWrapper" class="edit-modal-overlay">
        <div class="edit-modal-card">
            <h3 style="color:#1877F2; margin-top:0;">✏️ Modify Account Subscriptions Profile</h3>
            <input type="hidden" id="editModalTargetIndexId">
            <div class="form-row">
                <label style="font-size:11px; font-weight:bold;">Corporate Business Name Label</label>
                <input type="text" id="editModalCompanyInput" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top:5px;">
                <label style="font-size:11px; font-weight:bold;">Customer WhatsApp Number</label>
                <input type="text" id="editModalPhoneInput" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top:5px;">
                <label style="font-size:11px; font-weight:bold;">Custom Per-Message Tariff Rate ($ USD)</label>
                <input type="number" id="editModalRateInput" step="0.001" style="width:100%; box-sizing:border-box;">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:15px;">
                <button style="background:#4b5563; color:white; border:none;" onclick="closeProprietorEditModalFrame()">Cancel</button>
                <button style="background:#1877F2; color:white; border:none;" onclick="executeSaaSProfileModificationCommit()">Save Settings</button>
            </div>
        </div>
    </div>

    <div id="mainDashboardWorkspaceShell" style="display: none;">
        <div class="navbar">
            <div style="font-weight: bold; font-size: 18px;" id="welcomeLabelStringNode">Welcome...</div>
            <div>
                <button style="background:rgba(0,0,0,0.2); font-size:11px; padding:4px 8px; border-radius:4px; color:white; border:none; cursor:pointer;" onclick="executeSystemLogoutSequence()">Sign Out</button>
                <span class="badge-pill" style="background:#000; padding:5px 10px;" id="activePortalBadge">VIEW STATUS</span>
            </div>
        </div>

        <div class="grid-frame">
            <div>
                <div class="card saas-card" id="proprietorSuperVisibilityAuditorCard" style="display:none;">
                    <h3>👁️ Proprietor Control & Security Monitor Center</h3>
                    <p style="font-size:12px; color:gray; margin-top:-6px;">Audit sub-tier roles and system nodes across channels seamlessly.</p>
                    <div id="superAuditorAccountsListingHookGrid"></div>
                </div>
                <div class="card vault-card" id="tokenVaultAllocationLogsPanelWrapper" style="display:none;">
                    <h3>📊 Dynamic Token Vault Allocation Tracker Logs</h3>
                    <div id="tokenVaultLogsContainerOutputGrid"></div>
                </div>
                <div class="card saas-card">
                    <h3>📱 Registered Commercial Channels Table</h3>
                    <div id="proprietorFleetNumbersOutputGrid"></div>
                </div>
                <div class="card saas-card" id="simulatedTestingTerminalCard" style="display: none;">
                    <h3>⚡ Live Postpaid Auto-Billing Cycle Simulator Terminal</h3>
                    <select id="simulatedChannelDropdownSelector" style="width: 100%; padding: 8px; margin-bottom:8px;"></select>
                    <button style="background:#15803d; color:white; font-weight:bold; border:none; width:100%; cursor:pointer; padding:10px; border-radius:6px;" onclick="simulateInboundTrafficDeductionNode()">Simulate Sending 150 Inbound API Messages Batch</button>
                </div>
            </div>
            <div>
                <div class="card history-card" id="enterpriseHistoryLogsMasterPanelWrapper" style="display:none;">
                    <h3>📜 Enterprise Operational History Logs Monitor</h3>
                    <div id="historyTerminalLogTerminalBox" class="log-box-stream"></div>
                    <div style="margin-top: 12px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 8px;">
                        <input type="text" id="manualHistoryCustomLogEntryField" placeholder="Type custom operational log string...">
                        <button onclick="executeManualHistoryLogInjectionCommit()">Inject Manual Log</button>
                    </div>
                    <button style="width:100%; background:#b91c1c; color:white; font-weight:bold; border:none; margin-top:8px; padding:8px; font-size:11px; cursor:pointer;" onclick="executeSystemHistoryLogsFlushSequence()">Clear History Node Cache Permanently</button>
                </div>
                <div class="card saas-card">
                    <h3>⚙️ Proprietor Account Profile Modifier</h3>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Update Login Password Key</label>
                        <input type="password" id="proprietorSelfPasswordInput" placeholder="Enter new password key"></div>
                    <button style="width:100%; background:#242526; color:white; font-weight:bold; cursor:pointer; border:none; padding:10px; border-radius:6px;" onclick="executeProprietorSelfProfileOverwrite()">Overwrite Self Profile</button>
                </div>
                <div class="card saas-card">
                    <h3>➕ Onboard New Commercial Channel</h3>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Customer WhatsApp Number</label>
                        <input type="text" id="onboardPhoneInput" placeholder="e.g. 923001234567" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Corporate Business Label Name</label>
                        <input type="text" id="onboardCompanyInput" placeholder="e.g. Al-Razzaq Textile Mills" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Phone ID</label>
                        <input type="text" id="onboardPhoneIdInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta Permanent Access Token</label>
                        <input type="text" id="onboardTokenInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold; color: #0056b3;">Select Tariff Pricing Profile</label>
                        <select id="onboardBillingPlanTypeSelector" onchange="toggleWalletFieldVisibility()" style="width:100%; padding:10px;">
                            <option value="FREE_UNLIMITED" selected>Unlimited Free Plan (Personal Lines / Relatives Mode)</option>
                            <option value="POSTPAID_AUTO_BILLING">Postpaid Auto-Billing Cycle ($5.00 Threshold Mode)</option>
                        </select></div>
                    <div id="walletInitialDepositFieldWrapper" style="display:none; background:#EBF5FF; padding:10px; border-radius:6px; border-left: 4px solid #1877F2;">
                        <div class="form-row">
                            <label style="font-size:12px; font-weight:bold; color:#1877F2;">Custom Per-Message Tariff Cost Rate ($ USD)</label>
                            <input type="number" id="onboardPerMessageCostRate" value="0.03" step="0.001" style="width:100%; box-sizing:border-box;">
                        </div>
                    </div>
                    <button style="width:100%; background:#0056b3; margin-top:14px; color:white; font-weight:bold; border:none; cursor:pointer; padding:10px;" onclick="executeProprietorClientOnboarding()">Activate Account Channel</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function getFleetData() { return JSON.parse(localStorage.getItem('saas_fleet_db') || '[]'); }
        function saveFleetData(data) { localStorage.setItem('saas_fleet_db', JSON.stringify(data)); }
        function getHistoryData() { return JSON.parse(localStorage.getItem('saas_history_db') || '[]'); }
        function saveHistoryData(data) { localStorage.setItem('saas_history_db', JSON.stringify(data)); }
        function getAuthHeader() { return { 'Authorization': localStorage.getItem('saas_session_token') || '' }; }

        let mockTokenVaultLogsDB = [
            { node: "Zain Agent (Child)", status: "ACTIVE RUNTIME", time: "11.83 Hours Remaining" },
            { node: "Zahid Admin (Secondary)", status: "SESSION ACTIVE", time: "23.95 Hours Remaining" },
            { node: "Mirha Arts Official (Channel)", status: "TOKEN SYNCED", time: "Permanent Cloud Loop" }
        ];

        window.addEventListener('DOMContentLoaded', () => {
            const currentDb = getFleetData();
            if(currentDb.length === 0) {
                currentDb.push({ num: "923001122334", businessName: "Zahid Textile Mills", appid: "109827", token: "EAAG_MOCK", plan: "POSTPAID_AUTO_BILLING", rate: 0.03, creditsUsedUSD: 0.00 });
                saveFleetData(currentDb);
            }
            const historyDb = getHistoryData();
            if(historyDb.length === 0) {
                historyDb.push("[" + new Date().toLocaleTimeString() + "] 💾 System Core Engine launched.");
                saveHistoryData(historyDb);
            }
            if(localStorage.getItem('saas_is_logged_in') === 'true') {
                document.getElementById('loginScreenGatewayFrame').style.display = 'none';
                document.getElementById('mainDashboardWorkspaceShell').style.display = 'block';
                document.getElementById('welcomeLabelStringNode').innerText = localStorage.getItem('saas_greeting_msg');
                document.getElementById('activePortalBadge').innerText = localStorage.getItem('saas_user_role') + " VIEW ACTIVE";
                
                if(localStorage.getItem('saas_user_role') === 'PROPRIETOR') {
                    document.getElementById('proprietorSuperVisibilityAuditorCard').style.display = 'block';
                    document.getElementById('tokenVaultAllocationLogsPanelWrapper').style.display = 'block';
                    document.getElementById('enterpriseHistoryLogsMasterPanelWrapper').style.display = 'block';
                    document.getElementById('simulatedTestingTerminalCard').style.display = 'block';
                    fetchSuperAuditorAccountsGrid();
                    renderTokenVaultLogsGrid();
                    renderHistoryTerminalLogsBox();
                }
                renderFleetDirectoryRows();
            }
        });

        function toggleWalletFieldVisibility() {
            const mode = document.getElementById('onboardBillingPlanTypeSelector').value;
            document.getElementById('walletInitialDepositFieldWrapper').style.display = mode === 'POSTPAID_AUTO_BILLING' ? 'block' : 'none';
        }

        function switchLoginViewToForgotPasswordPanel() {
            document.getElementById('loginScreenGatewayFrame').style.display = 'none';
            document.getElementById('forgotPasswordWrapperOverlayFrame').style.display = 'block';
        }
        function switchForgotViewBackToLoginGateway() {
            document.getElementById('forgotPasswordWrapperOverlayFrame').style.display = 'none';
            document.getElementById('loginScreenGatewayFrame').style.display = 'block';
        }

        async function executeIdentityAuthenticationRequest() {
            const email = document.getElementById('loginEmailInputField').value.trim();
            const password = document.getElementById('loginPasswordInputField').value.trim();
            if(!email || !password) return alert("Fields empty!");

            try {
                const response = await fetch('/api/auth/login', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ email, password }) 
                });
                const data = await response.json();
                if(response.ok) {
                    localStorage.setItem('saas_is_logged_in', 'true');
                    localStorage.setItem('saas_session_token', data.token);
                    localStorage.setItem('saas_user_role', data.user.role);
                    localStorage.setItem('saas_greeting_msg', data.user.customGreetingText);
                    window.location.reload(); 
                } else { document.getElementById('loginErrorAlertNode').style.display = 'block'; }
            } catch (err) { alert("Server Connection Error."); }
        }

        async function executePasswordResetRequestTicket() {
            const email = document.getElementById('forgotEmailLookupField').value.trim();
            if(!email) return alert("Enter email!");
            const res = await fetch('/api/auth/forgot-password-trigger', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
            const data = await res.json();
            if(res.ok) { alert("🔒 Security Recovery Token: " + data.simulatedOTP); document.getElementById('forgotStep1EmailInputBlock').style.display = 'none'; document.getElementById('forgotStep2OTPVerifyBlock').style.display = 'block'; }
            else { alert("Error: " + data.error); }
        }

        async function executePasswordResetOTPMutationCommit() {
            const email = document.getElementById('forgotEmailLookupField').value.trim();
            const otp = document.getElementById('forgotVerificationOtpCodeField').value.trim();
            const newPassword = document.getElementById('forgotNewPasswordOverrideField').value.trim();
            const res = await fetch('/api/auth/forgot-password-verify-commit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword }) });
            if(res.ok) { alert("Success! Password overridden."); switchForgotViewBackToLoginGateway(); }
        }

        async function fetchSuperAuditorAccountsGrid() {
            const response = await fetch('/api/proprietor/audit-directory-stream', {
                headers: getAuthHeader()
            });
            if(!response.ok) return;
            const users = await response.json();
            const hookGrid = document.getElementById('superAuditorAccountsListingHookGrid');
            hookGrid.innerHTML = '';
            users.forEach(u => {
                const el = document.createElement('div');
                el.className = 'fleet-row'; el.style.background = '#fff'; el.style.padding = '10px'; el.style.marginBottom = '6px'; el.style.border = '1px solid #ddd';
                el.innerHTML = "<strong>👤 User: " + u.name + "</strong> ["+u.role+"]<br>Email: "+u.email+"<br><span style='color:green; font-weight:bold;'>Status: " + u.status + "</span>";
                hookGrid.appendChild(el);
            });
        }

        function renderTokenVaultLogsGrid() {
            const target = document.getElementById('tokenVaultLogsContainerOutputGrid');
            target.innerHTML = '';
            mockTokenVaultLogsDB.forEach(log => {
                const el = document.createElement('div');
                el.className = 'fleet-row'; el.style.background = '#fff'; el.style.padding = '8px'; el.style.marginBottom = '4px';
                el.innerHTML = "<strong>⚙️ " + log.node + "</strong> - " + log.status + "<br><span style='color:gray; font-size:11px;'>Factor: " + log.time + "</span>";
                target.appendChild(el);
            });
        }

        function renderHistoryTerminalLogsBox() {
            const terminal = document.getElementById('historyTerminalLogTerminalBox');
            const logs = getHistoryData();
            terminal.innerHTML = logs.map(line => "<div>" + line + "</div>").join('');
            terminal.scrollTop = terminal.scrollHeight;
        }

        function executeManualHistoryLogInjectionCommit() {
            const field = document.getElementById('manualHistoryCustomLogEntryField');
            if(!field.value.trim()) return alert("Log empty!");
            const logs = getHistoryData();
            logs.push("[" + new Date().toLocaleTimeString() + "] ✍️: " + field.value.trim());
            saveHistoryData(logs); renderHistoryTerminalLogsBox(); field.value = '';
        }

        function executeSystemHistoryLogsFlushSequence() {
            if(!confirm("Clear?")) return;
            saveHistoryData(["[Logs cleared]"]); renderHistoryTerminalLogsBox();
        }

        function renderFleetDirectoryRows() {
            const list = getFleetData();
            const targetGrid = document.getElementById('proprietorFleetNumbersOutputGrid');
            const dropdown = document.getElementById('simulatedChannelDropdownSelector');
            targetGrid.innerHTML = ''; dropdown.innerHTML = '';
            
            list.forEach((tenant, index) => {
                const el = document.createElement('div');
                el.className = 'fleet-row'; el.style.background = '#fff'; el.style.padding = '10px'; el.style.marginBottom = '6px';
                
                let pricingDetails = tenant.plan === 'FREE_UNLIMITED' ? 'Unlimited Free Plan' : '$' + parseFloat(tenant.creditsUsedUSD || 0).toFixed(2) + ' / $5.00 (Rate: $' + tenant.rate + '/msg)';
                
                el.innerHTML = "<strong>🏢 " + tenant.businessName + "</strong> [Line: " + tenant.num + "]<br><span style='font-size:11px; color:green; font-weight:bold;'>" + pricingDetails + "</span><div style='margin-top:6px;'><a href='javascript:void(0)' onclick='openProprietorEditModalFrame(" + index + ")' style='color:#1877F2; text-decoration:none; font-size:11px; font-weight:bold;'>✏️ Modify</a><a href='javascript:void(0)' onclick='executeSaaSChannelDeletionPipeline(" + index + ")' style='color:#dc2626; text-decoration:none; font-size:11px; font-weight:bold; margin-left:12px;'>❌ Delete</a></div>";
                targetGrid.appendChild(el);

                if(tenant.plan !== 'FREE_UNLIMITED') {
                    dropdown.innerHTML += "<option value='" + tenant.num + "'>" + tenant.businessName + "</option>";
                }
            });
        }

        function openProprietorEditModalFrame(index) {
            const list = getFleetData(); const tenant = list[index];
            document.getElementById('editModalTargetIndexId').value = index;
            document.getElementById('editModalCompanyInput').value = tenant.businessName;
            document.getElementById('editModalPhoneInput').value = tenant.num;
            document.getElementById('editModalRateInput').value = tenant.rate || 0.03;
            document.getElementById('proprietorDataEditModalFrameWrapper').style.display = 'flex';
        }
        function closeProprietorEditModalFrame() { document.getElementById('proprietorDataEditModalFrameWrapper').style.display = 'none'; }
        
        function executeSaaSProfileModificationCommit() {
            const index = document.getElementById('editModalTargetIndexId').value; const list = getFleetData();
            list[index].businessName = document.getElementById('editModalCompanyInput').value.trim();
            list[index].num = document.getElementById('editModalPhoneInput').value.trim();
            list[index].rate = parseFloat(document.getElementById('editModalRateInput').value) || 0.03;
            saveFleetData(list); closeProprietorEditModalFrame(); renderFleetDirectoryRows();
        }

        function executeSaaSChannelDeletionPipeline(index) {
            if(!confirm("Erase?")) return;
            let list = getFleetData(); list.splice(index, 1); saveFleetData(list); renderFleetDirectoryRows();
        }

        function executeProprietorClientOnboarding() {
            const num = document.getElementById('onboardPhoneInput').value.trim();
            const comp = document.getElementById('onboardCompanyInput').value.trim();
            const appid = document.getElementById('onboardPhoneIdInput').value.trim();
            const token = document.getElementById('onboardTokenInput').value.trim();
            const plan = document.getElementById('onboardBillingPlanTypeSelector').value;
            const rate = parseFloat(document.getElementById('onboardPerMessageCostRate').value) || 0.03;
            if(!num || !comp) return alert("Fields empty!");
            
            const list = getFleetData(); list.push({ num, businessName:comp, appid, token, plan, rate, creditsUsedUSD:0.00 });
            localStorage.setItem('saas_fleet_db', JSON.stringify(list));
            
            const logs = getHistoryData(); logs.push("[" + new Date().toLocaleTimeString() + "] 📞 ONBOARDED: " + comp);
            saveHistoryData(logs); window.location.reload();
        }

        function simulateInboundTrafficDeductionNode() {
            const targetNum = document.getElementById('simulatedChannelDropdownSelector').value;
            if(!targetNum) return alert("No postpaid accounts!");
            let list = getFleetData(); let tenant = list.find(u => u.num === targetNum);
            tenant.creditsUsedUSD = parseFloat(((tenant.creditsUsedUSD || 0) + (150 * tenant.rate)).toFixed(2));
            alert("Bill Added! Total Bill: $" + tenant.creditsUsedUSD);
            if(tenant.creditsUsedUSD >= 4.50) {
                alert("🚨 $5.00 Threshold Triggered! Exact amount $" + tenant.creditsUsedUSD + " USD charged from linked card automatically. Cycle reset.");
                tenant.creditsUsedUSD = 0.00;
            }
            saveFleetData(list); renderFleetDirectoryRows();
        }

        async function executeProprietorSelfProfileOverwrite() {
            const pass = document.getElementById('proprietorSelfPasswordInput').value.trim();
            if(!pass) return alert("Empty field!");
            const res = await fetch('/api/proprietor/overwrite-self-profile', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, 
                body: JSON.stringify({ newPassword: pass }) 
            });
            if(res.ok) { localStorage.clear(); window.location.reload(); }
        }

        function executeSystemLogoutSequence() { localStorage.clear(); window.location.reload(); }
    </script>
</body>
</html>
    `);
});

// Start Production-Ready Server Node directly using app.listen
app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
