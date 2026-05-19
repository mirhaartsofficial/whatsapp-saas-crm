// crm_system.js
// Final Unified Production Architecture: Save as crm_system.js
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// Dynamic port rendering for cloud deployment
const PORT = process.env.PORT || 10000; 
const server = http.createServer(app);

function generateSecureHash(password) { 
    return crypto.createHmac('sha256', 'master_salt_key_999').update(password).digest('hex'); 
}

// Confidential Identities Master Registry Engine
let systemUsersDB = [
    { id: "owner_01", name: "Saadi Main Owner", email: "asadaltaf9@gmail.com", passwordHash: generateSecureHash("Saadi@3002"), role: "OWNER" },
    { id: "prop_01", name: "Mirha Arts Executive Proprietor", email: "mirhaartsofficial@gmail.com", passwordHash: generateSecureHash("Saad!@3002"), role: "PROPRIETOR" }
];

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meta SaaS Command Base Framework</title>
        <style>
            :root { --meta-blue: #1877F2; --meta-zinc: #242526; --meta-bg: #F0F2F5; --text: #1C1E21; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--meta-bg); margin: 0; padding: 0; color: var(--text); }
            .navbar { background: var(--meta-blue); color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .grid-frame { display: grid; grid-template-columns: 1fr; gap: 16px; padding: 16px; max-width: 1300px; margin: auto; }
            @media(min-width: 992px) { .grid-frame { grid-template-columns: 1.4fr 1fr; } }
            .card { background: white; border-radius: 8px; border: 1px solid #CCD0D5; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 16px; }
            .saas-card { border-top: 4px solid #0056b3; background: #F0F7FF; }
            .form-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; text-align: left; }
            input, select, button { padding: 10px; border-radius: 6px; border: 1px solid #CCD0D5; font-size: 14px; outline: none; }
            .fleet-row { background: white; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #D2D6DC; font-size: 12px; border-left: 5px solid #0056b3; display: flex; justify-content: space-between; align-items: center; }
            .badge-pill { padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; background: #65676B; }
            .login-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; margin: auto; margin-top: 10vh; box-sizing: border-box; }
            
            /* High intensity clickable anchor layout style */
            .btn-meta { display: block; background-color: #1877F2; color: white; padding: 14px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(24,119,242,0.2); text-align: center; box-sizing: border-box; border: none; width: 100%; cursor: pointer; }
            .btn-meta:hover { background-color: #166FE5; }
            
            .error-alert { display: none; background-color: #FDE8E8; border: 1px solid #E53E3E; color: #C53030; padding: 12px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; text-align: left; }
        </style>
    </head>
    <body style="background: #F0F2F5;">

    <!-- Section 1: Non-Reloading Click Interceptor Secure Login Screen -->
    <div id="loginScreenGatewayFrame" style="display: block;">
        <div class="login-card">
            <h2 style="color: #1877F2; margin-top: 0; margin-bottom: 5px;">Log In to Meta SaaS</h2>
            <p style="color: gray; font-size: 13px; margin-bottom: 20px;">Enter credentials authorized inside configurations</p>
            
            <!-- Red Warning Popup element -->
            <div id="loginErrorAlertNode" class="error-alert">
                ⚠️ Invalid Credentials! UserID/Password is incorrect.
            </div>

            <div class="form-row">
                <label style="font-weight: bold; font-size: 13px; color: #4A5568;">Secure Identity Email ID</label>
                <input type="email" id="loginEmailInputField" placeholder="name@business.com" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top: 5px;">
                <label style="font-weight: bold; font-size: 13px; color: #4A5568;">Password Verification Key</label>
                <input type="password" id="loginPasswordInputField" placeholder="••••••••" style="width:100%; box-sizing:border-box;">
            </div>
            
            <!-- Click Interceptor Anchor -->
            Authenticate Account</a>
        </div>
    </div>

    <!-- Section 2: Complete Operational Multi-Tenant SaaS Dashboards Space -->
    <div id="mainDashboardWorkspaceShell" style="display: none;">
        <div class="navbar">
            <div style="font-weight: bold; font-size: 18px;" id="welcomeLabelStringNode">Welcome...</div>
            <div>
                <button style="background:rgba(0,0,0,0.2); font-size:11px; padding:4px 8px; border-radius:4px; color:white; border:none; cursor:pointer;" onclick="executeSystemLogoutSequence()">Sign Out</button>
                <span class="badge-pill" style="background:#000; padding:5px 10px;" id="activePortalBadge">PROPRIETOR VIEW</span>
            </div>
        </div>

        <div class="grid-frame">
            <!-- Left Grid Framework Column Layout -->
            <div>
                <div class="card saas-card">
                    <h3>🛡️ Proprietor Account Central Fleet Matrix</h3>
                    <p style="font-size:12px; color:#606770; margin-top:-6px;">Twilio/Interakt Mode: Monitor numbers data streams, dynamic billing allocations, and configurations here.</p>
                    <div id="proprietorFleetNumbersOutputGrid"></div>
                </div>
            </div>

            <!-- Right Grid Framework Column Layout (Pricing Tariff Selector Installed) -->
            <div>
                <div class="card saas-card">
                    <h3>➕ Onboard New Commercial Paid / Free Number</h3>
                    <p style="font-size:11px; color:#555; margin-top:-6px;">Set "Unlimited Free Plan" for relatives or personal service lines, and "Per-Message" for customers.</p>
                    
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Customer WhatsApp Number</label>
                        <input type="text" id="onboardPhoneInput" placeholder="e.g. 923001234567" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Corporate Business Label Name</label>
                        <input type="text" id="onboardCompanyInput" placeholder="e.g. Mirha Arts Official" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Phone Number ID</label>
                        <input type="text" id="onboardPhoneIdInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Permanent Token Key</label>
                        <input type="text" id="onboardTokenInput" style="width:100%; box-sizing:border-box;"></div>
                    
                    <div class="form-row"><label style="font-size:12px; font-weight:bold; color: #0056b3;">Select Tariff Pricing Profile</label>
                        <select id="onboardBillingPlanTypeSelector" onchange="toggleWalletFieldVisibility()" style="width:100%; padding:10px;">
                            <option value="FREE_UNLIMITED" selected>Unlimited Free Plan (Personal Lines / Relatives Mode)</option>
                            <option value="PAID_PER_MESSAGE">Paid Per-Message Billing Mode (Commercial Clients Tier)</option>
                        </select></div>
                    
                    <div class="form-row" id="walletInitialDepositFieldWrapper" style="display:none; background:#EBF5FF; padding:10px; border-radius:6px;">
                        <label style="font-size:12px; font-weight:bold; color:#1877F2;">Initial Cash Wallet Deposit Amount ($ USD)</label>
                        <input type="number" id="onboardInitialWalletAmount" value="10.00" step="1" style="width:100%; box-sizing:border-box;"></div>
                    
                    <button style="width:100%; background:#0056b3; margin-top:14px; color:white; font-weight:bold; border:none; cursor:pointer;" onclick="executeProprietorClientOnboarding()">Activate Account Channel</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function getFleetData() { return JSON.parse(localStorage.getItem('saas_fleet_db') || '[]'); }

        // Persistent Anti-Refresh Status Synchronization logic
        window.addEventListener('DOMContentLoaded', () => {
            if(localStorage.getItem('saas_is_logged_in') === 'true') {
                document.getElementById('loginScreenGatewayFrame').style.display = 'none';
                document.getElementById('mainDashboardWorkspaceShell').style.display = 'block';
                document.getElementById('welcomeLabelStringNode').innerText = localStorage.getItem('saas_greeting_msg');
                document.getElementById('activePortalBadge').innerText = localStorage.getItem('saas_user_role') + " VIEW ACTIVE";
                renderFleetDirectoryRows();
            }
        });

        function toggleWalletFieldVisibility() {
            const mode = document.getElementById('onboardBillingPlanTypeSelector').value;
            document.getElementById('walletInitialDepositFieldWrapper').style.display = mode === 'PAID_PER_MESSAGE' ? 'block' : 'none';
        }

        // Core Non-Reloading AJAX Login Function (Guarantees Active Button Clicks Response)
        async function executeIdentityAuthenticationRequest() {
            const email = document.getElementById('loginEmailInputField').value.trim();
            const passwordField = document.getElementById('loginPasswordInputField');
            const password = passwordField.value.trim();
            const errorBox = document.getElementById('loginErrorAlertNode');

            if(!email || !password) return alert("Please fill up all credential fields!");
            errorBox.style.display = 'none';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                if(response.ok) {
                    // Lock persistent tokens straight inside localStorage before hiding components
                    localStorage.setItem('saas_is_logged_in', 'true');
                    localStorage.setItem('saas_user_role', data.user.role);
                    localStorage.setItem('saas_greeting_msg', data.user.customGreetingText);

                    document.getElementById('loginScreenGatewayFrame').style.display = 'none';
                    document.getElementById('mainDashboardWorkspaceShell').style.display = 'block';
                    
                    // Fixed Brand text assignment rules
                    document.getElementById('welcomeLabelStringNode').innerText = data.user.customGreetingText;
                    document.getElementById('activePortalBadge').innerText = data.user.role + " VIEW ACTIVE";
                    renderFleetDirectoryRows();
                } else { 
                    // Blank password box and pop up the beautiful red warning banner text layout instantly
                    passwordField.value = ''; 
                    passwordField.focus();
                    errorBox.style.display = 'block';
                }
            } catch (err) { alert("Network Connection Error. Check Render Logs."); }
        }

        document.getElementById('loginPasswordInputField').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') executeIdentityAuthenticationRequest();
        });

        function renderFleetDirectoryRows() {
            const list = getFleetData();
            const targetGrid = document.getElementById('proprietorFleetNumbersOutputGrid');
            targetGrid.innerHTML = '';
            list.forEach(tenant => {
                targetGrid.innerHTML += \`
                    <div class="fleet-row">
                        <div><strong>🏢 \${tenant.businessName}</strong> [Line: \${tenant.num}]<br><span style="color:#555; font-size:11px;">Meta App ID: \${tenant.appid}</span></div>
                        <div><span class="badge-pill" style="background:\${tenant.plan === 'FREE_UNLIMITED' ? '#4b5563' : '#15803d'}; color:#fff;">\${tenant.balanceLabel}</span></div>
                    </div>\`;
            });
        }

        function executeProprietorClientOnboarding() {
            const num = document.getElementById('onboardPhoneInput').value;
            const comp = document.getElementById('onboardCompanyInput').value;
            const appid = document.getElementById('onboardPhoneIdInput').value;
            const token = document.getElementById('onboardTokenInput').value;
            const plan = document.getElementById('onboardBillingPlanTypeSelector').value;
            const amt = document.getElementById('onboardInitialWalletAmount').value;

            if(!num || !comp || !appid || !token) return alert("All enterprise parameters are required!");
            
            const balanceLabel = plan === 'FREE_UNLIMITED' ? "Unlimited Free Plan" : "$ " + parseFloat(amt).toFixed(2) + " USD Credits";
            const list = getFleetData();
            list.push({ num, businessName:comp, appid, token, plan, balanceLabel });
            localStorage.setItem('saas_fleet_db', JSON.stringify(list));

            renderFleetDirectoryRows();
            document.getElementById('onboardPhoneInput').value = ''; document.getElementById('onboardCompanyInput').value = '';
            document.getElementById('onboardPhoneIdInput').value = ''; document.getElementById('onboardTokenInput').value = '';
            alert("Channel onboarding pricing profile successfully executed inside memory matrix.");
        }

        function executeSystemLogoutSequence() { localStorage.clear(); window.location.reload(); }
    </script>
    </body>
    </html>
    `);
});

// Secured Login Validation Endpoint Matrix mapping
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const inputHash = generateSecureHash(password);
    const user = systemUsersDB.find(u => u.email === email && u.passwordHash === inputHash);
    
    if (!user) return res.status(401).json({ error: "UserID/Password is incorrect!" });
    
    let customGreetingText = `Welcome, ${user.name}`;
    if (user.email === 'mirhaartsofficial@gmail.com') {
        customGreetingText = "Welcome, Mirha Arts Executive Proprietor";
    }

    res.json({ user: { name: user.name, role: user.role, customGreetingText } });
});

server.listen(PORT, () => console.log(`🚀 Unified System running flawlessly on Port ${PORT}`));
