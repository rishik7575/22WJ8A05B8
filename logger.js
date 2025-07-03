const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwiZXhwIjoxNzUxNTI5NDM5LCJpYXQiOjE3NTE1Mjg1MzksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMjY2NGQ3Ny1hOGE1LTQ0ODMtOTRiOS1mMTg1NGY4MTI2MmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaWsgdmVua2F0IHNoaXZhIHNhaSBtYWR1cmkiLCJzdWIiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMifSwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwibmFtZSI6InJpc2hpayB2ZW5rYXQgc2hpdmEgc2FpIG1hZHVyaSIsInJvbGxObyI6IjIyd2o4YTA1YjgiLCJhY2Nlc3NDb2RlIjoiUGJtVkFUIiwiY2xpZW50SUQiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMiLCJjbGllbnRTZWNyZXQiOiJ2VnZrdkZjRHBhanF0ZFpIIn0.9Tc9PLhmCqAGyXJTTxPdaag1kMs7xCW19oi3-Bc-u7Q";

async function sendLog(stack, level, packageName, message) {
    const apiUrl = "http://20.244.56.144/evaluation-service/logs";

    if (!authToken) {
        console.error("❌ No authentication token");
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
        console.error(`❌ Invalid package "${normalizedPackage}" for stack "${normalizedStack}"`);
        console.error(`   Valid packages for ${normalizedStack}: ${validPackages[normalizedStack].join(", ")}`);
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
            console.log("✅ Log sent:", payload);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Log failed: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error("💥 Error sending log:", error.message);
        return false;
    }
}

console.log("🚀 Testing logger with valid package names...\n");

// Only use valid packages for each stack
const testCases = [
    // Backend packages - only "auth" is valid
    { stack: "backend", level: "error", package: "auth", message: "Authentication error occurred" },
    { stack: "backend", level: "info", package: "auth", message: "User authenticated successfully" },
    { stack: "backend", level: "debug", package: "auth", message: "Auth token validated" },
    { stack: "backend", level: "warn", package: "auth", message: "Authentication warning" },

    // Frontend packages - only "component" is valid
    { stack: "frontend", level: "info", package: "component", message: "Component initialized" },
    { stack: "frontend", level: "error", package: "component", message: "Component failed to render" },
    { stack: "frontend", level: "debug", package: "component", message: "Component rendered" },
    { stack: "frontend", level: "warn", package: "component", message: "Component deprecation warning" }
];

async function runTests() {
    for (const test of testCases) {
        console.log(`Testing: ${test.stack} - ${test.level} - ${test.package}`);
        await sendLog(test.stack, test.level, test.package, test.message);
        console.log(""); // Add spacing
    }
}

runTests();
