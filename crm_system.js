// crm_system.js
// Final Fixed Web Port Copy: Is ko crm_system.js ke naam se save karein
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// FIXED WEB GATE: Pull dynamic port from Render environment variables arrays
const PORT = process.env.PORT || 10000; 
const server = http.createServer(app);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/waba_saas_db";
mongoose.connect(MONGO_URI)
    .then(() => console.log("💾 MongoDB Persistent Database Connected Securely"))
    .catch(err => console.error("Database connection fault:", err));

const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, passwordHash: String, role: String });
const User = mongoose.model('User', UserSchema);

const FleetSchema = new mongoose.Schema({ phoneNumber: String, businessName: String, appId: String, token: String, balance: { type: String, default: "Unlimited Active Plan" } });
const Fleet = mongoose.model('Fleet', FleetSchema);

function generateSecureHash(password) { 
    return crypto.createHmac('sha256', 'master_salt_key_999').update(password).digest('hex'); 
}

async function seedRootIdentities() {
    const ownerExists = await User.findOne({ email: "asadaltaf9@gmail.com" });
    if (!ownerExists) {
        await User.create({ name: "Saadi Main Owner", email: "asadaltaf9@gmail.com", passwordHash: generateSecureHash("Saadi@3002"), role: "OWNER" });
        await User.create({ name: "Mirha Arts Executive Proprietor", email: "mirhaartsofficial@gmail.com", passwordHash: generateSecureHash("Saad!@3002"), role: "PROPRIETOR" });
        console.log("📝 Root identities seeded successfully into permanent storage collections.");
    }
}
seedRootIdentities();

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
                <label style="font-weight: bold; font-size: 13px;">Secure Identity Email ID</label>
                <input type="email" id="loginEmailInputField" placeholder="name@business.com" style="width:100%; box-sizing:border-box;">
            </div>
            <div class="form-row" style="margin-top: 5px;">
                <label style="font-weight: bold; font-size: 13px;">Password Verification Key</label>
                <input type="password" id="loginPasswordInputField" placeholder="••••••••" style="width:100%; box-sizing:border-box;">
            </div>
            Authenticate Account</button>
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
                    <div id="proprietorFleetNumbersOutputGrid"></div>
                </div>
            </div>
            <div>
                <div class="card saas-card">
                    <h3>➕ Onboard New Commercial Paid Number</h3>
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
        window.addEventListener('DOMContentLoaded', () => {
            if(localStorage.getItem('saas_is_logged_in') === 'true') {
                document.getElementById('loginScreenGatewayFrame').style.display = 'none';
                document.getElementById('mainDashboardWorkspaceShell').style.display = 'block';
                document.getElementById('welcomeLabelStringNode').innerText = localStorage.getItem('saas_greeting_msg');
                document.getElementById('activePortalBadge').innerText = localStorage.getItem('saas_user_role') + " VIEW ACTIVE";
                fetchFleetDirectoryRows();
            }
        });

        async function executeIdentityAuthenticationRequest() {
            const email = document.getElementById('loginEmailInputField').value.trim();
            const passwordField = document.getElementById('loginPasswordInputField');
            const password = passwordField.value.trim();
            const errorBox = document.getElementById('loginErrorAlertNode');
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
                    fetchFleetDirectoryRows();
                } else { passwordField.value = ''; passwordField.focus(); errorBox.style.display = 'block'; }
            } catch (err) { alert("Server connection failed."); }
        }

        async function fetchFleetDirectoryRows() {
            const res = await fetch('/api/proprietor/fleet-directory');
            const list = await res.json();
            const targetGrid = document.getElementById('proprietorFleetNumbersOutputGrid');
            targetGrid.innerHTML = '';
            list.forEach(tenant => {
                targetGrid.innerHTML += \`
                    <div class="fleet-row">
                        <div><strong>🏢 \${tenant.businessName}</strong> [Line: \${tenant.phoneNumber}]<br><span style="color:#555; font-size:11px;">Meta App ID: \${tenant.appId}</span></div>
                        <div><span class="badge-pill" style="background:#15803d; color:#fff;">\${tenant.balance}</span></div>
                    </div>\`;
            });
        }

        async function executeProprietorClientOnboarding() {
            const phoneNumber = document.getElementById('onboardPhoneInput').value;
            const businessName = document.getElementById('onboardCompanyInput').value;
            const appId = document.getElementById('onboardPhoneIdInput').value;
            const token = document.getElementById('onboardTokenInput').value;
            if(!phoneNumber || !businessName || !appId || !token) return alert("All specifications are required!");

            await fetch('/api/proprietor/onboard-tenant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, businessName, appId, token })
            });
            fetchFleetDirectoryRows();
            document.getElementById('onboardPhoneInput').value = ''; document.getElementById('onboardCompanyInput').value = '';
            document.getElementById('onboardPhoneIdInput').value = ''; document.getElementById('onboardTokenInput').value = '';
        }

        function executeSystemLogoutSequence() { localStorage.clear(); window.location.reload(); }
    </script>
    </body>
    </html>
    `);
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const inputHash = generateSecureHash(password);
    const user = await User.findOne({ email, passwordHash: inputHash });
    if (!user) return res.status(401).json({ error: "UserID/Password is incorrect!" });
    let customGreetingText = user.email === 'mirhaartsofficial@gmail.com' ? "Welcome, Mirha Arts Executive Proprietor" : `Welcome, ${user.name}`;
    res.json({ user: { name: user.name, role: user.role, customGreetingText } });
});

app.post('/api/proprietor/onboard-tenant', async (req, res) => { await Fleet.create(req.body); res.json({ success: true }); });
app.get('/api/proprietor/fleet-directory', async (req, res) => { const list = await Fleet.find({}); res.json(list); });

server.listen(PORT, () => console.log(`🚀 Secure Enterprise SaaS Engine Online on Port ${PORT}`));
