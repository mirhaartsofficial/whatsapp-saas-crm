// crm_system.js
// Final Production Copy: Unified Multi-Tenant SaaS Engine with Postpaid Auto-Billing Credit Cycles
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
            :root { --meta-blue: #1877F2; --meta-bg: #F0F2F5; --text: #1C1E21; }
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
            .btn-meta { display: block; background-color: #1877F2; color: white; padding: 14px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(24,119,242,0.2); text-align: center; box-sizing: border-box; border: none; width: 100%; cursor: pointer; }
            .error-alert { display: none; background-color: #FDE8E8; border: 1px solid #E53E3E; color: #C53030; padding: 12px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; text-align: left; }
        </style>
    </head>
    <body style="background: #F0F2F5;">

    <div id="loginScreenGatewayFrame" style="display: block;">
        <div class="login-card">
            <h2 style="color: #1877F2; margin-top: 0; margin-bottom: 5px;">Log In to Meta SaaS</h2>
            <p style="color: gray; font-size: 13px; margin-bottom: 20px;">Enter credentials authorized inside configurations</p>
            <div id="loginErrorAlertNode" class="error-alert">⚠️ Invalid Credentials! UserID/Password is incorrect.</div>
            <div class="form-row">
                <label style="font-weight: bold; font-size: 13px; color: #4A5568;">Secure Identity Email ID</label>
                <input type="email" id="loginEmailInputField" placeholder="name@business.com" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top: 5px;">
                <label style="font-weight: bold; font-size: 13px; color: #4A5568;">Password Verification Key</label>
                <input type="password" id="loginPasswordInputField" placeholder="••••••••" style="width:100%; box-sizing:border-box;">
            </div>
            Authenticate Account</a>
        </div>
    </div>

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
                <div class="card saas-card">
                    <h3>🛡️ Proprietor Account Central Fleet Matrix</h3>
                    <p style="font-size:12px; color:#606770; margin-top:-6px;">Twilio/Interakt Mode: Monitor active billing metrics, current card usage, and postpaid credit cycles live.</p>
                    <div id="proprietorFleetNumbersOutputGrid"></div>
                </div>
                
                <!-- SIMULATED TRANSACTION TRIGGER: Testing message logs and automated card cuts live -->
                <div class="card saas-card" id="simulatedTestingTerminalCard" style="display: block;">
                    <h3>⚡ Live Postpaid Auto-Billing Cycle Simulator Terminal</h3>
                    <p style="font-size:11px; color:#555; margin-top:-6px;">Click to simulate sending bulk traffic on a paid number. Watch how it auto-charges exact figures once reaching the $4.50 - $5.00 limit threshold.</p>
                    <div class="form-row">
                        <label style="font-size:12px; font-weight:bold;">Select Target Simulated Channel</label>
                        <select id="simulatedChannelDropdownSelector" style="width: 100%; padding: 8px;"></select>
                    </div>
                    <button style="background:#15803d; color:white; font-weight:bold; margin-top:5px; border:none; width:100%; cursor:pointer; padding:10px; border-radius:6px;" onclick="simulateInboundTrafficDeductionNode()">Simulate Sending 150 Inbound API Messages Batch</button>
                </div>
            </div>

            <div>
                <div class="card saas-card">
                    <h3>➕ Onboard New Commercial Paid / Free Number</h3>
                    <p style="font-size:11px; color:#555; margin-top:-6px;">Set "Unlimited Free Plan" for personal lines/relatives, and "Postpaid Auto-Billing" for clients.</p>
                    
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Customer WhatsApp Number</label>
                        <input type="text" id="onboardPhoneInput" placeholder="e.g. 923001234567" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Corporate Business Label Name</label>
                        <input type="text" id="onboardCompanyInput" placeholder="e.g. Al-Razzaq Textile Mills" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Phone Number ID</label>
                        <input type="text" id="onboardPhoneIdInput" style="width:100%; box-sizing:border-box;"></div>
                    <div class="form-row"><label style="font-size:12px; font-weight:bold;">Meta App Permanent Token Key</label>
                        <input type="text" id="onboardTokenInput" style="width:100%; box-sizing:border-box;"></div>
                    
                    <div class="form-row"><label style="font-size:12px; font-weight:bold; color: #0056b3;">Select Tariff Pricing Profile</label>
                        <select id="onboardBillingPlanTypeSelector" onchange="toggleWalletFieldVisibility()" style="width:100%; padding:10px;">
                            <option value="FREE_UNLIMITED" selected>Unlimited Free Plan (Personal Lines / Relatives Mode)</option>
                            <option value="POSTPAID_AUTO_BILLING">Postpaid Auto-Billing Cycle ($5.00 Threshold Mode)</option>
                        </select></div>
                    
                    <!-- ADJUSTED CONFIG PANEL: Proprietor sets custom rate for postpaid clients directly -->
                    <div id="walletInitialDepositFieldWrapper" style="display:none; background:#EBF5FF; padding:10px; border-radius:6px; border-left: 4px solid #1877F2;">
                        <div class="form-row">
                            <label style="font-size:12px; font-weight:bold; color:#1877F2;">Custom Per-Message Tariff Cost Rate ($ USD)</label>
                            <input type="number" id="onboardPerMessageCostRate" value="0.03" step="0.001" style="width:100%; box-sizing:border-box;">
                        </div>
                    </div>
                    
                    <button style="width:100%; background:#0056b3; margin-top:14px; color:white; font-weight:bold; border:none; cursor:pointer;" onclick="executeProprietorClientOnboarding()">Activate Account Channel</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function getFleetData() { return JSON.parse(localStorage.getItem('saas_fleet_db') || '[]'); }
        function saveFleetData(data) { localStorage.setItem('saas_fleet_db', JSON.stringify(data)); }

        window.addEventListener('DOMContentLoaded', () => {
            // Seed a starter mock postpaid client if db is entirely fresh for simulation readiness
            const currentDb = getFleetData();
            if(currentDb.length === 0) {
                currentDb.push({
                    num: "923001122334", businessName: "Zahid Textile Mills", appid: "109827", token: "EAAG_MOCK",
                    plan: "POSTPAID_AUTO_BILLING", rate: 0.03, creditsUsedUSD: 0.00
                });
                saveFleetData(currentDb);
            }

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
            document.getElementById('walletInitialDepositFieldWrapper').style.display = mode === 'POSTPAID_AUTO_BILLING' ? 'block' : 'none';
        }

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
                    localStorage.setItem('saas_is_logged_in', 'true');
                    localStorage.setItem('saas_user_role', data.user.role);
                    localStorage.setItem('saas_greeting_msg', data.user.customGreetingText);

                    document.getElementById('loginScreenGatewayFrame').style.display = 'none';
                    document.getElementById('mainDashboardWorkspaceShell').style.display = 'block';
                    
                    document.getElementById('welcomeLabelStringNode').innerText = data.user.customGreetingText;
                    document.getElementById('activePortalBadge').innerText = data.user.role + " VIEW ACTIVE";
                    renderFleetDirectoryRows();
                } else { 
                    passwordField.value = ''; 
                    passwordField.focus();
                    errorBox.style.display = 'block';
                }
            } catch (err) { alert("Server Connection Error."); }
        }

        document.getElementById('loginPasswordInputField').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') executeIdentityAuthenticationRequest();
        });

        function renderFleetDirectoryRows() {
            const list = getFleetData();
            const targetGrid = document.getElementById('proprietorFleetNumbersOutputGrid');
            const dropdown = document.getElementById('simulatedChannelDropdownSelector');
            
            targetGrid.innerHTML = '';
            dropdown.innerHTML = '';

            list.forEach(tenant => {
                let statusLabelHTML = '';
                if(tenant.plan === 'FREE_UNLIMITED') {
                    statusLabelHTML = '<span class="badge-pill" style="background:#4b5563; color:#fff;">Unlimited Free Plan</span>';
                } else {
                    statusLabelHTML = \`<span class="badge-pill" style="background:#b91c1c; color:#fff;">Current Bill: $\${parseFloat(tenant.creditsUsedUSD).toFixed(2)} / $5.00</span><br><span style="font-size:10px; color:gray; display:block; margin-top:2px;">Rate: $\${tenant.rate}/msg</span>\`;
                    // Push postpaid channels down into the simulation test dropdown options node
                    dropdown.innerHTML += \`<option value="\${tenant.num}">\${tenant.businessName} (\${tenant.num})</option>\`;
                }

                targetGrid.innerHTML += \`
                    <div class="fleet-row">
                        <div><strong>🏢 \${tenant.businessName}</strong> [Line: \${tenant.num}]<br><span style="color:#555; font-size:11px;">Meta App ID: \${tenant.appid}</span></div>
                        <div style="text-align: right;">\${statusLabelHTML}</div>
                    </div>\`;
            });
        }

        function executeProprietorClientOnboarding() {
            const num = document.getElementById('onboardPhoneInput').value.trim();
            const comp = document.getElementById('onboardCompanyInput').value.trim();
            const appid = document.getElementById('onboardPhoneIdInput').value.trim();
            const token = document.getElementById('onboardTokenInput').value.trim();
            const plan = document.getElementById('onboardBillingPlanTypeSelector').value;
            const rate = parseFloat(document.getElementById('onboardPerMessageCostRate').value) || 0.03;

            if(!num || !comp || !appid || !token) return alert("All enterprise parameters are required!");
            
            const list = getFleetData();
            list.push({ num, businessName:comp, appid, token, plan, rate, creditsUsedUSD: 0.00 });
            saveFleetData(list);

            renderFleetDirectoryRows();
            document.getElementById('onboardPhoneInput').value = ''; document.getElementById('onboardCompanyInput').value = '';
            document.getElementById('onboardPhoneIdInput').value = ''; document.getElementById('onboardTokenInput').value = '';
            alert("Channel onboarding configuration profile initialized successfully.");
        }

        // AUTO-DEBIT SIMULATOR: Increments usage and triggers exact amount transaction settlement on $5 threshold rules
        function simulateInboundTrafficDeductionNode() {
            const targetNum = document.getElementById('simulatedChannelDropdownSelector').value;
            if(!targetNum) return alert("No active postpaid channels registered to simulate!");

            let list = getFleetData();
            let tenant = list.find(u => u.num === targetNum);

            // Simulate batch execution cost parameters (e.g. 150 messages * custom rate string)
            const batchUsageCost = 150 * tenant.rate; 
            tenant.creditsUsedUSD = parseFloat((tenant.creditsUsedUSD + batchUsageCost).toFixed(2));

            alert(\`Traffic Simulated! Batch Cost added: $\${batchUsageCost.toFixed(2)} USD. Total Accumulated Bill: $\${tenant.creditsUsedUSD.toFixed(2)} USD.\`);

            // AUTOMATED BILLING THRESHOLD CHECK ($4.50 - $5.00 limit trigger check)
            if (tenant.creditsUsedUSD >= 4.50) {
                const exactAmountToCut = tenant.creditsUsedUSD;
                
                alert(\`🚨 BILLING THRESHOLD TRIGGERED!\\nAccumulated limit reached $\${exactAmountToCut.toFixed(2)} USD.\\n\\nInitiating automatic card charge sequence...\`);
                alert(\`💳 BANK API SUCCESS!\\nExact amount charged successfully from client linked card: $\${exactAmountToCut.toFixed(2)} USD (No extra roundups charged!).\`);
                
                // INSTANT CYCLE RESET: Flush usage metric variables back down straight to zero line parameter
                tenant.creditsUsedUSD = 0.00;
                alert("🔄 Billing cycle synchronized and reset back to $0.00 instantly. System active nonstop.");
            }

            saveFleetData(list);
            renderFleetDirectoryRows();
        }

        function executeSystemLogoutSequence() { localStorage.clear(); window.location.reload(); }
    </script>
    </body>
    </html>
    `);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const inputHash = generateSecureHash(password);
    const user = systemUsersDB.find(u => u.email === email && u.passwordHash === inputHash);
    
    if (!user) return res.status(401).json({ error: "UserID/Password is incorrect!" });
    
    let customGreetingText = user.email === 'mirhaartsofficial@gmail.com' ? "Welcome, Mirha Arts Executive Proprietor" : `Welcome, ${user.name}`;
    res.json({ user: { name: user.name, role: user.role, customGreetingText } });
});

server.listen(PORT, () => console.log(`🚀 Unified System running flawlessly on Port ${PORT}`));
