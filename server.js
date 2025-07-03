// server.js - Main Express server for the Logger Dashboard
// Author: Rishik (and a little help from friends)
// This file handles log forwarding to the evaluation service and serves the dashboard UI.

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

// NOTE: In a real app, never hardcode tokens! This is just for demo/testing.
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwiZXhwIjoxNzUxNTI4MTAwLCJpYXQiOjE3NTE1MjcyMDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMGNmNThjMC05YTVmLTRmOGItYmI2Ni04MTk5YTE4YzE5MWQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaWsgdmVua2F0IHNoaXZhIHNhaSBtYWR1cmkiLCJzdWIiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMifSwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwibmFtZSI6InJpc2hpayB2ZW5rYXQgc2hpdmEgc2FpIG1hZHVyaSIsInJvbGxObyI6IjIyd2o4YTA1YjgiLCJhY2Nlc3NDb2RlIjoiUGJtVkFUIiwiY2xpZW50SUQiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMiLCJjbGllbnRTZWNyZXQiOiJ2VnZrdkZjRHBhanF0ZFpIIn0.AI2WgNL8hmWC9Dgh99ws6hEsqg1xoLj6tWLVnP-rRpc";

// Helper to send logs to the evaluation service
async function sendLog(stackName, severity, pkgName, logMsg) {
    const apiUrl = "http://20.244.56.144/evaluation-service/logs";
    
    const dataToSend = {
        stack: stackName.toLowerCase(),
        level: severity.toLowerCase(),
        package: pkgName.toLowerCase(),
        message: logMsg
    };

    if (!authToken) {
        throw new Error("❌ Oops! No authentication token found. Please check your config.");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            return { success: true, data: dataToSend };
        } else {
            const errorText = await response.text();
            throw new Error(`Server said no (HTTP ${response.status}): ${errorText}`);
        }
    } catch (error) {
        throw new Error(`Couldn't send log: ${error.message}`);
    }
}

// Serve the main dashboard/test page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to receive logs from the UI
app.post('/api/log', async (req, res) => {
    try {
        const { stack, level, package: pkg, message } = req.body;
        
        if (!stack || !level || !pkg || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: stack, level, package, message' 
            });
        }

        const result = await sendLog(stack, level, pkg, message);
        res.json({ success: true, message: '🎉 Log sent successfully!', data: result.data });
        
    } catch (error) {
        console.error('💥 Error sending log:', error.message);
        res.status(500).json({ 
            error: 'Something went wrong while sending the log.', 
            details: error.message 
        });
    }
});

// Fun test endpoint to send a bunch of logs
app.get('/api/test', async (req, res) => {
    try {
        const testLogs = [
            { stack: 'backend', level: 'error', package: 'api', message: 'Test error message' },
            { stack: 'frontend', level: 'info', package: 'auth', message: 'Test info message' },
            { stack: 'backend', level: 'debug', package: 'db', message: 'Test debug message' },
            { stack: 'backend', level: 'warn', package: 'validation', message: 'Test warning message' }
        ];

        const results = [];
        for (const log of testLogs) {
            try {
                const result = await sendLog(log.stack, log.level, log.package, log.message);
                results.push({ ...log, status: 'success', data: result.data });
            } catch (error) {
                results.push({ ...log, status: 'failed', error: error.message });
            }
        }

        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Test failed (yikes!)', details: error.message });
    }
});

// TODO: Add authentication middleware if this ever goes to production!
app.listen(PORT, () => {
    console.log(`🚀 Logger server running at http://localhost:${PORT}`);
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`📝 API endpoint: http://localhost:${PORT}/api/log`);
});
