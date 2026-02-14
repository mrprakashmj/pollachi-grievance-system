import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function verifyAuth() {
    console.log('Starting Auth Verification...');

    const email = `testuser_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    let cookie = '';

    // 1. Register
    console.log(`\n1. Registering user: ${email}`);
    try {
        const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Monitor',
                email,
                password,
                phone: '1234567890',
                address: '123 Test St',
                role: 'public' // optional if default
            })
        });

        if (!registerRes.ok) {
            const errText = await registerRes.text();
            throw new Error(`Registration failed: ${registerRes.status} ${errText}`);
        }

        const registerData = await registerRes.json();
        console.log('   ✅ Registration success:', registerData.user.email);
    } catch (error) {
        console.error('   ❌ Registration error:', error.message);
        return;
    }

    // 2. Login
    console.log('\n2. Logging in...');
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            const errText = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${errText}`);
        }

        const loginData = await loginRes.json();
        // Extract cookie
        const setCookieHeader = loginRes.headers.raw()['set-cookie'];
        if (setCookieHeader) {
            cookie = setCookieHeader.map(c => c.split(';')[0]).join('; ');
            console.log('   ✅ Login success. Cookie received.');
        } else {
            console.warn('   ⚠️  Login success but no cookie received?');
        }

    } catch (error) {
        console.error('   ❌ Login error:', error.message);
        return;
    }

    // 3. Get Me
    console.log('\n3. Verifying Session (GET /api/auth/me)...');
    try {
        const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: {
                'Cookie': cookie
            }
        });

        if (!meRes.ok) {
            const errText = await meRes.text();
            throw new Error(`Me endpoint failed: ${meRes.status} ${errText}`);
        }

        const meData = await meRes.json();
        if (meData.user.email === email) {
            console.log('   ✅ Session Verified. User:', meData.user.email);
        } else {
            console.error('   ❌ Session Verification Failed. Expected email mismatch.');
        }

    } catch (error) {
        console.error('   ❌ Me endpoint error:', error.message);
        process.exit(1);
    }
}

verifyAuth().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
