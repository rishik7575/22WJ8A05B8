// logger.js - Custom logger for the URL Shortener frontend
// This file helps send logs to the evaluation service. Not fancy, but it works!
// Written by a human (who likes to know what's going on)

// NOTE: Don't hardcode tokens in real projects! This is just for demo/testing.
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwiZXhwIjoxNzUxNTI5NDM5LCJpYXQiOjE3NTE1Mjg1MzksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMjY2NGQ3Ny1hOGE1LTQ0ODMtOTRiOS1mMTg1NGY4MTI2MmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaWsgdmVua2F0IHNoaXZhIHNhaSBtYWR1cmkiLCJzdWIiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMifSwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwibmFtZSI6InJpc2hpayB2ZW5rYXQgc2hpdmEgc2FpIG1hZHVyaSIsInJvbGxObyI6IjIyd2o4YTA1YjgiLCJhY2Nlc3NDb2RlIjoiUGJtVkFUIiwiY2xpZW50SUQiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMiLCJjbGllbnRTZWNyZXQiOiJ2VnZrdkZjRHBhanF0ZFpIIn0.9Tc9PLhmCqAGyXJTTxPdaag1kMs7xCW19oi3-Bc-u7Q";

/**
 * Actually sends the log to the backend
 * @param {string} stack - 'frontend' or 'backend'
 * @param {string} level - 'info', 'warn', 'error', 'debug'
 * @param {string} packageName - Which package/module is logging
 * @param {string} message - The log message
 * @returns {Promise<boolean>} - True if sent, false otherwise
 */
async function sendLog(stack, level, packageName, message) {
    const apiUrl = "http://20.244.56.144/evaluation-service/logs";

    if (!authToken) {
        // If you see this, you forgot to set your token!
        console.error("❌ Oops! No authentication token found. Please check your config.");
        return false;
    }

    // Only allow certain package names for each stack
    const validPackages = {
        "backend": ["auth"],
        "frontend": ["component"]
    };

    const normalizedStack = stack.toLowerCase();
    const normalizedPackage = packageName.toLowerCase();

    // Check if the stack and package combo is valid
    if (!validPackages[normalizedStack] || !validPackages[normalizedStack].includes(normalizedPackage)) {
        // Oops, wrong package for this stack!
        console.error(`❌ Invalid package "${normalizedPackage}" for stack "${normalizedStack}"`);
        return false;
    }

    try {
        const payload = {
            stack: normalizedStack,
            level: level.toLowerCase(),
            package: normalizedPackage,
            message: message
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Friendly confirmation in the console
            console.log("✅ Log sent!", payload);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Log failed: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        // Something went wrong with the network or server
        console.error("💥 Error sending log:", error.message);
        return false;
    }
}

// Logger class for use in React components
class Logger {
    // Info log (for normal stuff)
    static async info(message) {
        return await sendLog("frontend", "info", "component", message);
    }
    // Warning log (for things that might be a problem)
    static async warn(message) {
        return await sendLog("frontend", "warn", "component", message);
    }
    // Error log (for when things break)
    static async error(message) {
        return await sendLog("frontend", "error", "component", message);
    }
    // Debug log (for nerdy details)
    static async debug(message) {
        return await sendLog("frontend", "debug", "component", message);
    }
}

// TODO: Add more log levels if needed!
export default Logger;