import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie'; // default import

const jar = new CookieJar();

// Wrap native fetch with fetch-cookie
const fetchWithCookies = fetchCookie(globalThis.fetch, jar);

const BASE_URL = 'http://localhost:8080';

async function runTest() {
    try {
        console.log('--- Starting Auth Flow Test ---');

        const uniqueId = Date.now();
        const userData = {
            name: `Test User ${uniqueId}`,
            username: `testuser${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            password: 'password123'
        };

        // 1. Register
        console.log('\n1. Registering User...');
        const registerRes = await fetchWithCookies(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const registerData = await registerRes.json();
        console.log('Register Response:', registerRes.status, registerData);

        if (registerRes.status !== 201) throw new Error('Registration failed');

        console.log('Cookies after registration:', jar.getCookieStringSync(BASE_URL));

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await fetchWithCookies(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: userData.email, password: userData.password })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginRes.status, loginData);

        if (loginRes.status !== 200) throw new Error('Login failed');

        // 3. Renew session
        console.log('\n3. Renewing Session...');
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
