/**
 * File Name: crm_system.js
 * Description: Production-Ready Core Script for Multi-Tier WhatsApp SaaS Platform
 * Tech Stack: Node.js / Express.js (With Mock Database Storage for Instant Testing)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

const app = express();
app.use(express.json());

// JWT Secret Key for Session Management
const JWT_SECRET = "SUPREME_GOD_MODE_SECRET_KEYS_2026_MIRHA";

// Global In-Memory Database (Real Database implementation mein Yeh PostgreSQL/MongoDB tables honge)
let usersTable = [];
let whitelistedNumbersTable = [];

// Hardcoded System Proprietor (The Ultimate God Account)
const PROPRIETOR_EMAIL = "mirhaartsofficial@gmail.com";
const PROPRIETOR_PASSWORD_PLAIN = "Saad!@3002";

// System Hierarchy Level Reference Weights
const ROLES_HIERARCHY = {
    'proprietor': 5,
    'main_owner': 4,
    'co_owner': 3,
    'admin': 2,
    'child': 1
};

// ==========================================
// 1. SYSTEM INITIALIZATION & SEEDING
// ==========================================
async function bootstrapSystem() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PROPRIETOR_PASSWORD_PLAIN, salt);
    
    // Seed the Supreme Proprietor into database
    const proprietorUser = {
        id: "proprietor-god-uuid-000000",
        whatsapp_number: "923000000000", // Default system master number
        email: PROPRIETOR_EMAIL,
        password: hashedPassword,
        role: 'proprietor',
        parent_id: null,
        main_owner_id: "proprietor-god-uuid-000000",
        is_unlimited: true,
        per_msg_cost_pkr: 0.00,
        wallet_balance: 99999999,
        status: 'active'
    };
    
    usersTable.push(proprietorUser);
    console.log(`[SYSTEM] Supreme Proprietor seeded successfully with Identification: ${PROPRIETOR_EMAIL}`);
}
bootstrapSystem();

// ==========================================
// 2. SECURITY MIDDLEWARES & HIERARCHY GUARDS
// ==========================================

// Token Extraction and Authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "Authentication Token Missing." });

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ success: false, message: "Session Expired or Invalid Token." });
        req.user = decodedUser;
        next();
    });
};

// Pure Hierarchy Guard (Enforces the Unbreakable Corporate Stack)
const guardHierarchyAndAccess = (req, res, next) => {
    const actor = req.user; // Logged-in entity executing the route
    const targetUserId = req.params.userId || req.body.targetUserId;

    // Find target in database
    const targetUser = usersTable.find(u => u.id === targetUserId);
    if (!targetUser) {
        return res.status(404).json({ success: false, message: "Target user profile not found in system database." });
    }

    // RULE 1: PROPRIETOR IS GOD. If actor is the absolute proprietor email, bypass all checks instantly.
    if (actor.email === PROPRIETOR_EMAIL && actor.role === 'proprietor') {
        return next();
    }

    // RULE 2: Protect Proprietor from everyone. No one can touch, view, modify, block or remove the Proprietor.
    if (targetUser.email === PROPRIETOR_EMAIL || targetUser.role === 'proprietor') {
        return res.status(403).json({ 
            success: false, 
            message: "Fatal Error: Supreme Proprietor cannot be accessed, modified, or terminated by any tier." 
        });
    }

    // RULE 3: Main Owner can ONLY be removed, modified or bypassed by the Platform Proprietor.
    if (targetUser.role === 'main_owner') {
        return res.status(403).json({ 
            success: false, 
            message: "Action Blocked: Main Owners are locked. Only the System Proprietor holds deletion/modification power." 
        });
    }

    // RULE 4: Linear Rank Check. Lower/Equal ranks cannot touch higher or equal ranks.
    const actorPower = ROLES_HIERARCHY[actor.role];
    const targetPower = ROLES_HIERARCHY[targetUser.role];

    if (actorPower <= targetPower) {
        return res.status(403).json({ 
            success: false, 
            message: `Hierarchy Violation: Your tier (${actor.role.toUpperCase()}) does not hold rights over a ${targetUser.role.toUpperCase()} tier.` 
        });
    }

    // RULE 5: Cross-Tenant Multi-Dashboard Isolation.
    // Standard tiers cannot jump branches to touch another Main Owner's child structures.
    if (actor.main_owner_id !== targetUser.main_owner_id) {
        return res.status(403).json({ 
            success: false, 
            message: "Security Isolation: You cannot interact with nodes outside your own operational hierarchy branch." 
        });
    }

    next();
};

// ==========================================
// 3. CORE ROUTING PLATFORM ENDPOINTS
// ==========================================

// Global Login Endpoint for All Tiers (Returns customized role identification)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = usersTable.find(u => u.email === email);
        if (!user) return res.status(404).json({ success: false, message: "Identity records do not match." });

        if (user.status === 'blocked' || user.status === 'suspended') {
            return res.status(403).json({ success: false, message: "This dashboard account has been locked by administration." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ success: false, message: "Invalid credentials." });

        // Generate customized payload profile token
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            whatsapp_number: user.whatsapp_number,
            main_owner_id: user.main_owner_id
        };

        const sessionToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            success: true,
            message: `Welcome back. Identified System Rank: [${user.role.toUpperCase()}]`,
            token: sessionToken,
            dashboardLayout: {
                role: user.role,
                userId: user.id,
                mainOwnerId: user.main_owner_id,
                features: user.role === 'child' ? ['messaging_only'] : ['full_management_analytics']
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// [PROPRIETOR ROUTE ONLY] - Whitelist a phone number to claim a separate dashboard cluster
app.post('/api/proprietor/whitelist-number', authenticateToken, (req, res) => {
    // Hard check to verify identity
    if (req.user.email !== PROPRIETOR_EMAIL || req.user.role !== 'proprietor') {
        return res.status(403).json({ success: false, message: "Unauthorized. This action requires God Mode access." });
    }

    const { whatsappNumber } = req.body;
    if (!whatsappNumber) return res.status(400).json({ message: "WhatsApp phone number is required." });

    const trackingId = "WHITELIST-" + Math.floor(100000 + Math.random() * 900000);
    whitelistedNumbersTable.push({
        id: trackingId,
        whatsapp_number: whatsappNumber,
        status: 'pending_registration'
    });

    return res.status(201).json({
        success: true,
        message: `Number ${whatsappNumber} has been authorized. Ready to register as Main Owner via its own dashboard instance.`,
        trackingId
    });
});

// [PUBLIC / INITIALIZATION ROUTE] - The Whitelisted Number claims its Main Owner status
app.post('/api/auth/register-main-owner', async (req, res) => {
    const { whatsappNumber, email, password } = req.body;

    // Verify if number was authorized by the Proprietor
    const verificationIndex = whitelistedNumbersTable.findIndex(
        w => w.whatsapp_number === whatsappNumber && w.status === 'pending_registration'
    );

    if (verificationIndex === -1) {
        return res.status(403).json({ 
            success: false, 
            message: "Registration Refused. This number is not whitelisted by the system Proprietor." 
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const uniqueMainOwnerId = "MO-UUID-" + Math.floor(100000 + Math.random() * 900000);

        const newMainOwner = {
            id: uniqueMainOwnerId,
            whatsapp_number: whatsappNumber,
            email: email,
            password: hashedPassword,
            role: 'main_owner',
            parent_id: "proprietor-god-uuid-000000", // Rooted directly to Proprietor
            main_owner_id: uniqueMainOwnerId,       // Sub-root cluster base identity
            is_unlimited: false,
            per_msg_cost_pkr: 1.50, // Default baseline cost setup
            wallet_balance: 0.00,
            status: 'active'
        };

        usersTable.push(newMainOwner);
        
        // Update Whitelist Status records
        whitelistedNumbersTable[verificationIndex].status = 'registered';

        return res.status(201).json({
            success: true,
            message: "Cluster setup successful. You are registered as the Main Owner of this dashboard.",
            mainOwnerId: uniqueMainOwnerId
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// [HIERARCHY MANAGEMENT ROUTE] - Create Lower-Tier Accounts (Co-Owner, Admin, Child)
app.post('/api/cluster/create-user', authenticateToken, async (req, res) => {
    const actor = req.user;
    const { email, password, targetRole, whatsappNumber } = req.body;

    if (actor.role === 'child') {
        return res.status(403).json({ success: false, message: "Child accounts do not have creation access." });
    }

    // Verify structural bounds
    const actorPower = ROLES_HIERARCHY[actor.role];
    const targetPower = ROLES_HIERARCHY[targetRole];

    if (actorPower <= targetPower) {
        return res.status(403).json({ 
            success: false, 
            message: `Operation denied. Your role cannot spawn a tier of equal or greater status (${targetRole.toUpperCase()}).` 
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const childNodeId = "NODE-UUID-" + Math.floor(100000 + Math.random() * 900000);

        const newSubUser = {
            id: childNodeId,
            whatsapp_number: whatsappNumber || actor.whatsapp_number,
            email: email,
            password: hashedPassword,
            role: targetRole,
            parent_id: actor.id,
            main_owner_id: actor.main_owner_id, // Inherited cluster scope bounds
            is_unlimited: false,
            per_msg_cost_pkr: 1.50,
            wallet_balance: 0.00,
            status: 'active'
        };

        usersTable.push(newSubUser);

        return res.status(201).json({
            success: true,
            message: `Account created successfully under ID: ${childNodeId}. Assigned Role: [${targetRole.toUpperCase()}]`
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// [PROTECTED HIERARCHY ROUTE] - Modify Any User Parameter (Bypasses to God Mode automatically if Proprietor changes rules)
app.put('/api/cluster/update-user/:userId', authenticateToken, guardHierarchyAndAccess, async (req, res) => {
    const { perMsgCost, isUnlimited, status, newPassword } = req.body;
    const targetUserId = req.params.userId;

    try {
        const userIndex = usersTable.findIndex(u => u.id === targetUserId);
        
        if (perMsgCost !== undefined) usersTable[userIndex].per_msg_cost_pkr = perMsgCost;
        if (isUnlimited !== undefined) usersTable[userIndex].is_unlimited = isUnlimited;
        if (status !== undefined) usersTable[userIndex].status = status;
        
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            usersTable[userIndex].password = await bcrypt.hash(newPassword, salt);
        }

        return res.status(200).json({ 
            success: true, 
            message: `Configurations for account node [${targetUserId}] successfully modified by authority command.` 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// [PROTECTED HIERARCHY ROUTE] - Remove User Account from Tree
app.delete('/api/cluster/remove-user/:userId', authenticateToken, guardHierarchyAndAccess, (req, res) => {
    const targetUserId = req.params.userId;
    
    usersTable = usersTable.filter(u => u.id !== targetUserId);
    
    return res.status(200).json({ 
        success: true, 
        message: `Account node [${targetUserId}] removed completely from system registry.` 
    });
});

// ==========================================
// 4. METABUSINESS MESSAGING ROUTER & BILLING ENGINE
// ==========================================
app.post('/api/whatsapp/send-message', authenticateToken, async (req, res) => {
    const actor = req.user;
    const { destinationPhone, messagePayload, metaPhoneId, metaAccessToken } = req.body;

    try {
        const sessionUser = usersTable.find(u => u.id === actor.id);

        // BILLING FLOW / GOD MODE OVERRIDE ENGINE
        // Skip balance checks if user has unlimited access configuration enabled, or if it is the primary Proprietor account
        if (!sessionUser.is_unlimited && sessionUser.email !== PROPRIETOR_EMAIL) {
            const dynamicCost = sessionUser.per_msg_cost_pkr;
            
            if (sessionUser.wallet_balance < dynamicCost) {
                return res.status(402).json({ 
                    success: false, 
                    message: "Transaction Aborted. Insufficient funds in cluster wallet balance. Please contact your manager." 
                });
            }
            
            // Deduct system usage allocation pricing
            sessionUser.wallet_balance -= dynamicCost;
        }

        // Mock Execution layer for Meta Webhook Interfaces. Replace URL with Meta Production Endpoints when live.
        console.log(`[META TELECOM HUB] Routing message outward via node ID: ${metaPhoneId || 'System-Default'}`);
        
        return res.status(200).json({
            success: true,
            message: "Message processed through engine successfully.",
            deduction: sessionUser.is_unlimited ? "0.00 PKR (Unlimited Mode)" : `${sessionUser.per_msg_cost_pkr} PKR`,
            currentBalanceRemaining: sessionUser.wallet_balance
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 5. ENGINE START INITIALIZATION ENGINE
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` SYSTEM FILE: crm_system.js IS LIVE                             `);
    console.log(` Active Engine Terminal Port Reference Address: ${PORT}          `);
    console.log(` SYSTEM CONFIGURATION: GOD MODE MAPPED TO SUPREME PROPRIETOR     `);
    console.log(`================================================================`);
});
