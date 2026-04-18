/**
 * BitRemit Multi-Rail Mock Payout Server
 * Use this for local development if you don't have real MPESA/GCASH/MTNMOMO APIs.
 */
import http from 'http';

const createServer = (name, port, handler) => {
    http.createServer((req, res) => {
        console.log(`[${name}] ${req.method} ${req.url}`);
        
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const data = body ? JSON.parse(body) : {};
            const response = handler(req, data);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
            console.log(`[${name}] Sent:`, response);
        });
    }).listen(port, () => {
        console.log(`[${name}] Service running on http://localhost:${port}`);
    });
};

// 1. MPESA (Port 3001)
createServer('MPESA', 3001, (req, data) => {
    return {
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CheckoutRequestID: 'ws_CO_' + Math.random().toString(36).slice(2, 10),
        MerchantRequestID: '6789-1234-5678'
    };
});

// 2. GCASH (Port 3002)
createServer('GCASH', 3002, (req, data) => {
    return {
        status: 'PENDING',
        paymentId: 'gcash_pay_' + Math.random().toString(36).slice(2, 10),
        message: 'Payment instruction received'
    };
});

// 3. MTNMOMO (Port 3003)
createServer('MTNMOMO', 3003, (req, data) => {
    return {
        status: 'PENDING',
        paymentId: 'momo_tx_' + Math.random().toString(36).slice(2, 10),
        message: 'Transfer initiated'
    };
});
