import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import { fetch as fetchCookie } from 'fetch-cookie';

const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

const BASE_URL = 'http://localhost:5000'; // Assuming port 5000, adjust if needed

async function runTest() {
    try {
        console.log('--- Starting Auth Flow Test ---');

        // 1. Register User
        const uniqueId = Date.now();
        const userData = {
            name: `Test User ${uniqueId}`,
            username: `testuser${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            password: 'password123'
        };

        console.log('\n1. Registering User...');
        const registerRes = await fetchWithCookies(`${BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const registerData = await registerRes.json();
        console.log('Register Response:', registerRes.status, registerData);

        if (registerRes.status !== 201) throw new Error('Registration failed');

        // Check cookies
        console.log('Cookies after registration:', jar.getCookieStringSync(BASE_URL));

        // 2. Login (Optional, since registration logs in, but good to test)
        console.log('\n2. Logging in...');
        const loginRes = await fetchWithCookies(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: userData.email, password: userData.password })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginRes.status, loginData);

        if (loginRes.status !== 200) throw new Error('Login failed');

        // 3. Renew Session
        console.log('\n3. Renewing Session...');
        // Wait a bit to ensure timestamps are different (optional)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const renewRes = await fetchWithCookies(`${BASE_URL}/api/sessions/renew`, {
            method: 'PUT'
        });
        const renewData = await renewRes.json();
        console.log('Renew Response:', renewRes.status, renewData);

        if (renewRes.status !== 200) throw new Error('Session renewal failed');

        console.log('Cookies after renewal:', jar.getCookieStringSync(BASE_URL));

        console.log('\n--- Test Passed Successfully ---');

    } catch (error) {
        console.error('\n--- Test Failed ---');
        console.error(error);
        process.exit(1);
    }
}

runTest();
