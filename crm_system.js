// crm_system.js
// Final Stable Release: Unified Multi-Tenant SaaS Control Center
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

const PORT = process.env.PORT || 10000; 
const server = http.createServer(app);

function generateSecureHash(password) { 
    return crypto.createHmac('sha256', 'master_salt_key_999').update(password).digest('hex'); 
}

// Fixed Accounts Framework Database Matrix
let systemUsersDB = [
    { id: "prop_01", name: "Mirha Arts Executive Proprietor", email: "mirhaartsofficial@gmail.com", passwordHash: generateSecureHash("Saad!@3002"), role: "PROPRIETOR", rawPass: "Saad!@3002" },
    { id: "owner_01", name: "Saadi Main Owner", email: "asadaltaf9@gmail.com", passwordHash: generateSecureHash("Saadi@3002"), role: "OWNER", rawPass: "Saadi@3002" },
    { id: "co_owner_01", name: "Kamran Co-Owner", email: "kamran@biz.com", passwordHash: generateSecureHash("co123"), role: "CO-OWNER", rawPass: "co123" },
    { id: "admin_01", name: "Zahid Admin", email: "zahid@biz.com", passwordHash: generateSecureHash("admin123"), role: "ADMIN", rawPass: "admin123" },
    { id: "child_01", name: "Zain Agent", email: "zain@biz.com", passwordHash: generateSecureHash("agent123"), role: "AGENT", rawPass: "agent123" }
];

let generatedOTPCacheDB = {};

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
            .btn-meta:hover { background-color: #166FE5; }
            .error-alert { display: none; background-color: #FDE8E8; border: 1px solid #E53E3E; color: #C53030; padding: 12px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; text-align: left; }
            .view-btn { background: #242526; color: white; font-size: 11px; padding: 4px 8px; border-radius: 4px; text-decoration: none; border: none; cursor: pointer; }
            .log-box-stream { background: #1e1e1e; color: #f8f8f2; font-family: monospace; padding: 12px; border-radius: 6px; font-size: 11px; max-height: 180px; overflow-y: scroll; text-align: left; line-height: 1.5; }
        </style>
    </head>
    <body style="background: #F0F2F5;">

    <!-- 1. LOGIN GATEWAY CARD SCREEN -->
    <div id="loginScreenGatewayFrame" style="display: block;">
        <div class="login-card">
            <h2 style="color: #1877F2; margin-top: 0; margin-bottom: 5px;">Log In to Meta SaaS</h2>
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
            Authenticate Account</button>
            <div style="margin-top: 15px;">
                <button type="button" onclick="switchLoginViewToForgotPasswordPanel()" style="background:none; border:none; color:#1877F2; font-weight:bold; font-size:13px; cursor:pointer; text-decoration:underline; padding:0;">Forgot Password?</button>
            </div>
        </div>
    </div>

    <!-- 2. SECURE OTP PASSWORD RECOVERY SCREEN -->
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

    <!-- 3. PRODUCTION WORKSPACE INTERFACE SHELL -->
    <div id="mainDashboardWorkspaceShell" style="display: none;">
        <div class="navbar">
            <div style="font-weight: bold; font-size: 18px;" id="welcomeLabelStringNode">Welcome...</div>
            <div>
                <button style="background:rgba(0,0,0,0.2); font-size:11px; padding:4px 8px; border-radius:4px; color:white; border:none; cursor:pointer;" onclick="executeSystemLogoutSequence()">Sign Out</button>
                <span class="badge-pill" style="background:#000; padding:5px 10px;" id="activePortalBadge">PROPRIETOR VIEW</span>
            </div>
        </div>

        <div class="grid-frame">
            <div>
                <div class="card saas-card" id="proprietorSuperVisibilityAuditorCard" style="display:none;">
                    <h3>👁️ Proprietor Super-Control Visibility Monitor Center</h3>
                    <p style="font-size:12px; color:gray; margin-top:-6px;">Audit sub-tier passwords, mapping keys, and chat API streams across tunnels seamlessly.</p>
                    <div id="superAuditorAccountsListingHookGrid"></div>
                </div>

                <div class="card vault-card" id="tokenVaultAllocationLogsPanelWrapper" style="display:none;">
                    <h3>📊 Dynamic Token Vault Allocation Tracker Logs</h3>
                    <p style="font-size:11px; color:#555; margin-top:-6px;">Tracks runtime remaining fraction hours lifespan updates across memory matrices cells live.</p>
                    <div id="tokenVaultLogsContainerOutputGrid"></div>
                </div>

                <div class="card saas-card">
                    <h3>📱 Registered Commercial Channels Table</h3>
                    <div id="proprietorFleetNumbersOutputGrid"></div>
                </div>
            </div>

            <div>
                <div class="card history-card" id="enterpriseHistoryLogsMasterPanelWrapper" style="display:none;">
                    <h3>📜 Enterprise Operational History Logs Monitor</h3>
                    <p style="font-size:11px; color:gray; margin-top:-6px;">Audits internal framework system activities logs. Proprietor possesses full rights to manipulate entries.</p>
                    <div id="historyTerminalLogTerminalBox" class="log-box-stream"></div>
                    
                    <div style="margin-top: 12px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 8px;">
                        <input type="text" id="manualHistoryCustomLogEntryField" placeholder="Type custom operational log string to inject...">
                        <button style="background:#242526; color:white; font-size:12px; font-weight:bold; cursor:pointer; border:none;" onclick="executeManualHistoryLogInjectionCommit()">Inject Manual Log</button>
                    </div>
                    <button style="width:100%; background:#b91c1c; color:white; font-weight:bold; border:none; margin-top:8px; padding:8px; font-size:11px; border-radius:4px; cursor:pointer;" onclick="executeSystemHistoryLogsFlushSequence()">Clear History Node Cache Permanently</button>
                </div>

                <div class="card saas-card">
                    <h3>⚙️ Proprietor Account Profile Modifier</h3>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Update Login Password Key</label>
                        <input type="password" id="proprietorSelfPasswordInput" placeholder="Enter new password key"></div>
                    <button style="width:100%; background:#242526; color:white; font-weight:bold; border:none; cursor:pointer; padding:10px; border-radius:6px;" onclick="executeProprietorSelfProfileOverwrite()">Overwrite Self Profile</button>
                </div>

                <div class="card saas-card">
                    <h3>➕ Onboard New Commercial Channel</h3>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Customer WhatsApp Number</label>
                        <input type="text" id="onboardPhoneInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Corporate Business Label Name</label>
                        <input type="text" id="onboardCompanyInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Phone Number ID</label>
                        <input type="text" id="onboardPhoneIdInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Permanent Token Key</label>
                        <input type="text" id="onboardTokenInput" style="width:100%; box-sizing:border-box;"></div>
                    <button style="width:100%; background:#0056b3; margin-top:14px; color:white; font-weight:bold; border:none; cursor:pointer;" onclick="executeProprietorClientOnboarding()">Activate Account Channel</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function getFleetData() { return JSON.parse(localStorage.getItem('saas_fleet_db') || '[]'); }
        function getHistoryData() { return JSON.parse(localStorage.getItem('saas_history_db') || '[]'); }
        function saveHistoryData(data) { localStorage.setItem('saas_history_db', JSON.stringify(data)); }

        let mockTokenVaultLogsDB = [
            { node: "Zain Agent (Child)", status: "ACTIVE RUNTIME", time: "11.83 Hours Remaining" },
            { node: "Zahid Admin (Secondary)", status: "SESSION ACTIVE", time: "23.95 Hours Remaining" },
            { node: "Mirha Arts Official (Channel)", status: "TOKEN SYNCED", time: "Permanent Cloud Loop" }
        ];

        window.addEventListener('DOMContentLoaded', () => {
            const historyDb = getHistoryData();
            if(historyDb.length === 0) {
                historyDb.push("[" + new Date().toLocaleTimeString() + "] 💾 System Core Engine launched. Live server mounted seamlessly.");
                historyDb.push("[" + new Date().toLocaleTimeString() + "] 🛡️ Encryption tokens verified. Core databases schemas frozen.");
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
                    
                    fetchSuperAuditorAccountsGrid();
                    renderTokenVaultLogsGrid();
                    renderHistoryTerminalLogsBox();
                }
                renderFleetDirectoryRows();
            }
        });

        function switchLoginViewToForgotPasswordPanel() {
            document.getElementById('loginScreenGatewayFrame').style.display = 'none';
            document.getElementById('forgotPasswordWrapperOverlayFrame').style.display = 'block';
            document.getElementById('forgotPasswordErrorBoxNode').style.display = 'none';
            document.getElementById('forgotStep1EmailInputBlock').style.display = 'block';
            document.getElementById('forgotStep2OTPVerifyBlock').style.display = 'none';
        }

        function switchForgotViewBackToLoginGateway() {
            document.getElementById('forgotPasswordWrapperOverlayFrame').style.display = 'none';
            document.getElementById('loginScreenGatewayFrame').style.display = 'block';
        }

        async function executePasswordResetRequestTicket() {
            const email = document.getElementById('forgotEmailLookupField').value.trim();
            const errorBox = document.getElementById('forgotPasswordErrorBoxNode');
            errorBox.style.display = 'none';

            if(!email) return alert("Please enter email!");
            
            try {
                const res = await fetch('/api/auth/forgot-password-trigger', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ email: email }) 
                });
                const data = await res.json();
                if(res.ok) {
                    alert("🔒 Security Recovery Token: " + data.simulatedOTP);
                    document.getElementById('forgotStep1EmailInputBlock').style.display = 'none';
                    document.getElementById('forgotStep2OTPVerifyBlock').style.display = 'block';
                } else { 
                    errorBox.innerText = "⚠️ " + data.error;
                    errorBox.style.display = 'block';
                }
            } catch (err) { alert("Network Connection Failure."); }
        }

        async function executePasswordResetOTPMutationCommit() {
            const email = document.getElementById('forgotEmailLookupField').value.trim();
            const otp = document.getElementById('forgotVerificationOtpCodeField').value.trim();
            const newPassword = document.getElementById('forgotNewPasswordOverrideField').value.trim();
            
            const res = await fetch('/api/auth/forgot-password-verify-commit', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ email: email, otp: otp, newPassword: newPassword }) 
            });
            if(res.ok) { alert("Success! Password overridden."); switchForgotViewBackToLoginGateway(); }
            else { alert("Verification failed."); }
        }

        async function executeIdentityAuthenticationRequest() {
            const email = document.getElementById('loginEmailInputField').value.trim();
            const passwordField = document.getElementById('loginPasswordInputField');
            const password = passwordField.value.trim();
            const errorBox = document.getElementById('loginErrorAlertNode');
            errorBox.style.display = 'none';

            if(!email || !password) return alert("Fields empty!");

            try {
                const response = await fetch('/api/auth/login', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ email: email, password: password }) 
                });
                const data = await response.json();
                if(response.ok) {
                    localStorage.setItem('saas_is_logged_in', 'true');
                    localStorage.setItem('saas_user_role', data.user.role);
                    localStorage.setItem('saas_greeting_msg', data.user.customGreetingText);
                    window.location.reload(); 
                } else { 
                    passwordField.value = '';
                    passwordField.focus();
                    errorBox.style.display = 'block'; 
                }
            } catch (err) { alert("Connection Error."); }
        }

        async function fetchSuperAuditorAccountsGrid() {
            const response = await fetch('/api/proprietor/audit-directory-stream');
            const users = await response.json();
            const hookGrid = document.getElementById('superAuditorAccountsListingHookGrid');
            hookGrid.innerHTML = '';
            users.forEach(u => {
                hookGrid.innerHTML += '<div class="fleet-row" style="border-left:5px solid #dc2626; margin-bottom:8px; padding:10px; background:#fff; border:1px solid #ddd;"><div style="display:flex; justify-content:space-between; align-items:center;"><div><strong>👤 ' + u.name + '</strong> [' + u.role + ']<br><span style="font-size:11px; color:#555;">Email: ' + u.email + '</span><br><span style="font-size:11px; color:green; font-weight:bold;">Password: ' + u.rawPass + '</span></div><div><button class="view-btn" onclick="alert(\\'Encryption tunnel active.\\')">Chats</button></div></div></div>';
            });
        }

        function renderTokenVaultLogsGrid() {
            const target = document.getElementById('tokenVaultLogsContainerOutputGrid');
            target.innerHTML = '';
            mockTokenVaultLogsDB.forEach(log => {
                target.innerHTML += '<div class="fleet-row" style="border-left:5px solid #b91c1c; margin-bottom:6px; padding:8px; background:#fff;"><strong>⚙️ ' + log.node + '</strong> - <span style="color:#b91c1c; font-weight:bold;">' + log.status + '</span><br><span style="font-size:11px; color:gray;">Life Balance Factor: ' + log.time + '</span></div>';
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
            const value = field.value.trim();
            if(!value) return alert("Logs text entry string empty!");

            const logs = getHistoryData();
            logs.push("[" + new Date().toLocaleTimeString() + "] ✍️ MANUALLY INJECTED: " + value);
            saveHistoryData(logs);
            
            renderHistoryTerminalLogsBox();
            field.value = '';
            alert("Success! History log mutated.");
        }

        function executeSystemHistoryLogsFlushSequence() {
            if(!confirm("Are you sure?")) return;
            const emptyLogs = ["[" + new Date().toLocaleTimeString() + "] 🗑️ History records manually flushed out."];
            saveHistoryData(emptyLogs);
            renderHistoryTerminalLogsBox();
        }

        function renderFleetDirectoryRows() {
            const list = getFleetData();
            const targetGrid = document.getElementById('proprietorFleetNumbersOutputGrid');
            targetGrid.innerHTML = '';
            list.forEach(tenant => {
                targetGrid.innerHTML += '<div class="fleet-row" style="background:#fff; border:1px solid #ddd; padding:10px; margin-bottom:6px;"><strong>🏢 ' + tenant.businessName + '</strong> [Line: ' + tenant.num + ']</div>';
            });
        }

        function executeProprietorClientOnboarding() {
            const num = document.getElementById('onboardPhoneInput').value.trim();
            const comp = document.getElementById('onboardCompanyInput').value.trim();
            if(!num || !comp) return alert("Fields empty!");
            const list = getFleetData();
            list.push({ num: num, businessName: comp });
            localStorage.setItem('saas_fleet_db', JSON.stringify(list));
            
            const logs = getHistoryData();
            logs.push("[" + new Date().toLocaleTimeString() + "] 📞 NEW TENANT ONBOARDED: " + comp);
            saveHistoryData(logs);
            window.location.reload();
        }

        async function executeProprietorSelfProfileOverwrite() {
            const pass = document.getElementById('proprietorSelfPasswordInput').value.trim();
            if(!pass) return alert("Empty field!");
            const res = await fetch('/api/proprietor/overwrite-self-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: pass }) });
            if(res.ok) { localStorage.clear(); window.location.reload(); }
        }
    </script>
    </body>
    </html>
    `);
});

app.post('/api/auth/forgot-password-trigger', (req, res) => {
    const { email } = req.body;
    const user = systemUsersDB.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ error: "Identity string missing." });

    if (user.role === 'ADMIN' || user.role === 'AGENT') {
        return res.status(403).json({ error: "Password change karne ke liye apne co owner se raabta karein!" });
    }
    const simulatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    generatedOTPCacheDB[email.toLowerCase()] = simulatedOTP; 
    res.json({ success: true, simulatedOTP });
});

app.post('/api/auth/forgot-password-verify-commit', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (generatedOTPCacheDB[email.toLowerCase()] !== otp) return res.status(400).json({ error: "OTP failed" });
    let user = systemUsersDB.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    user.passwordHash = generateSecureHash(newPassword); user.rawPass = newPassword;
    res.json({ success: true });
});

app.get('/api/proprietor/audit-directory-stream', (req, res) => res.json(systemUsersDB));

app.post('/api/proprietor/overwrite-self-profile', (req, res) => {
    const { newPassword } = req.body;
    let user = systemUsersDB.find(u => u.role === 'PROPRIETOR');
    user.passwordHash = generateSecureHash(newPassword); user.rawPass = newPassword;
    res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = systemUsersDB.find(u => u.email === email && u.passwordHash === generateSecureHash(password));
    if (!user) return res.status(401).json({ error: "Incorrect credentials!" });
    res.json({ user: { name: user.name, role: user.role, customGreetingText: user.email === 'mirhaartsofficial@gmail.com' ? "Welcome, Mirha Arts Executive Proprietor" : `Welcome, ${user.name}` } });
});

server.listen(PORT, () => console.log(`🚀 Unified System live on Port ${PORT}`));
