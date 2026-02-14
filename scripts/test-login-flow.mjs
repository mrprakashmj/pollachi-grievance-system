
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const EMAIL = `authtest_${Date.now()}@example.com`;
const PASSWORD = 'TestPassword123!';

async function testLoginFlow() {
    console.log('Starting End-to-End Login Test...');
    console.log(`Target Email: ${EMAIL}`);

    // 1. Register
    console.log('\n1. Registering...');
    try {
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Auto Test User',
                email: EMAIL,
                password: PASSWORD,
                phone: '9998887776',
                address: 'Test Address',
                pinCode: '642001'
            })
        });

        if (regRes.status === 201) {
            console.log('   ✅ Registration Successful');
        } else {
            const text = await regRes.text();
            console.error(`   ❌ Registration Failed: ${regRes.status}`, text);
            return; // Stop if register fails
        }

    } catch (e) {
        console.error('   ❌ Registration Network Error:', e.message);
        return;
    }

    // 2. Login
    console.log('\n2. Logging In...');
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD
            })
        });

        if (loginRes.status === 200) {
            const data = await loginRes.json();
            const setCookie = loginRes.headers.raw()['set-cookie'];
            console.log('   ✅ Login Successful');
            console.log(`   User ID: ${data.user.uid}`);
            console.log(`   Cookies Received: ${setCookie ? setCookie.length : 0}`);
            if (setCookie) {
                console.log('   Cookie Header:', setCookie[0].split(';')[0]);
            }
        } else {
            const text = await loginRes.text();
            console.error(`   ❌ Login Failed: ${loginRes.status}`, text);
        }

    } catch (e) {
        console.error('   ❌ Login Network Error:', e.message);
    }
}

testLoginFlow();
