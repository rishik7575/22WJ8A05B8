const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwiZXhwIjoxNzUxNTI5NDM5LCJpYXQiOjE3NTE1Mjg1MzksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMjY2NGQ3Ny1hOGE1LTQ0ODMtOTRiOS1mMTg1NGY4MTI2MmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaWsgdmVua2F0IHNoaXZhIHNhaSBtYWR1cmkiLCJzdWIiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMifSwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwibmFtZSI6InJpc2hpayB2ZW5rYXQgc2hpdmEgc2FpIG1hZHVyaSIsInJvbGxObyI6IjIyd2o4YTA1YjgiLCJhY2Nlc3NDb2RlIjoiUGJtVkFUIiwiY2xpZW50SUQiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMiLCJjbGllbnRTZWNyZXQiOiJ2VnZrdkZjRHBhanF0ZFpIIn0.9Tc9PLhmCqAGyXJTTxPdaag1kMs7xCW19oi3-Bc-u7Q";

async function sendLog(stack, level, packageName, message) {
    const apiUrl = "http://20.244.56.144/evaluation-service/logs";

    if (!authToken) {
        return false;
    }

    // Validate package names based on stack
    const validPackages = {
        "backend": ["auth"],
        "frontend": ["component"]
    };

    const normalizedStack = stack.toLowerCase();
    const normalizedPackage = packageName.toLowerCase();

    // Check if the stack and package combination is valid
    if (!validPackages[normalizedStack] || !validPackages[normalizedStack].includes(normalizedPackage)) {
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

        return response.ok;
    } catch (error) {
        return false;
    }
}

// Logger class for use in React components
class Logger {
    static async info(message) {
        return await sendLog("frontend", "info", "component", message);
    }

    static async warn(message) {
        return await sendLog("frontend", "warn", "component", message);
    }

    static async error(message) {
        return await sendLog("frontend", "error", "component", message);
    }

    static async debug(message) {
        return await sendLog("frontend", "debug", "component", message);
    }
}

export default Logger;