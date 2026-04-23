import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3000/api/orders';

async function testConcurrency() {
    console.log('--- Testing Concurrency: 5 users buying the last Limited Edition Watch (Stock: 1) ---');
    
    const requests = Array.from({ length: 5 }).map((_, i) => {
        return axios.post(API_URL, {
            userId: i + 1,
            idempotencyKey: uuidv4(),
            items: [{ productId: 4, quantity: 1 }]
        }).catch(err => err.response);
    });

    const results = await Promise.all(requests);
    
    const successes = results.filter(r => r.status === 201).length;
    const failures = results.filter(r => r.status === 400).length;

    console.log(`Successes: ${successes} (Expected: 1)`);
    console.log(`Failures: ${failures} (Expected: 4 - Insufficient Stock)`);
}

async function testIdempotency() {
    console.log('\n--- Testing Idempotency: Sending same request twice ---');
    const key = `test-key-${Date.now()}`;
    const payload = {
        userId: 1,
        idempotencyKey: key,
        items: [{ productId: 3, quantity: 1 }]
    };

    const first = await axios.post(API_URL, payload);
    console.log(`First Request Status: ${first.status} ${first.data.status}`);

    try {
        const second = await axios.post(API_URL, payload);
        console.log(`Second Request Status: ${second.status} ${second.data.status} (Expected: 409 DUPLICATE)`);
    } catch (err) {
        console.log(`Second Request Status: ${err.response.status} ${err.response.data.status} (Expected: 409 DUPLICATE)`);
    }
}

// Run the tests
(async () => {
    try {
        await testConcurrency();
        await testIdempotency();
    } catch (err) {
        console.error('Test script failed:', err.message);
    }
})();
