// logger.js

// NOTE: This is the auth token I grabbed during setup.
// TODO: Store securely later maybe?
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwiZXhwIjoxNzUxNTI4MTAwLCJpYXQiOjE3NTE1MjcyMDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxMGNmNThjMC05YTVmLTRmOGItYmI2Ni04MTk5YTE4YzE5MWQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaWsgdmVua2F0IHNoaXZhIHNhaSBtYWR1cmkiLCJzdWIiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMifSwiZW1haWwiOiJyaXNoaWttYWR1cmlAZ21haWwuY29tIiwibmFtZSI6InJpc2hpayB2ZW5rYXQgc2hpdmEgc2FpIG1hZHVyaSIsInJvbGxObyI6IjIyd2o4YTA1YjgiLCJhY2Nlc3NDb2RlIjoiUGJtVkFUIiwiY2xpZW50SUQiOiI5NzcwNTQ1MS0yOGFjLTRjNzctOTQyNC05ZWQyOWFkYTU2NTMiLCJjbGllbnRTZWNyZXQiOiJ2VnZrdkZjRHBhanF0ZFpIIn0.AI2WgNL8hmWC9Dgh99ws6hEsqg1xoLj6tWLVnP-rRpc";

// Function to log stuff to the service
async function sendLog(stackName, severity, pkgName, logMsg) {
    // I hardcoded this — might want to move to config later
    const apiUrl = "http://20.244.56.144/evaluation-service/logs";

    // Lowercase everything since the API is picky
    let stackLower = stackName.toLowerCase();
    let levelLower = severity.toLowerCase();
    let pkgLower = pkgName.toLowerCase();

    const dataToSend = {
        stack: stackLower,
        level: levelLower,
        package: pkgLower,
        message: logMsg
    };

    if (!authToken) {
        console.error("No token! Can't send log.");
        return;
    }

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(dataToSend)
        });

        if (res.ok) {
            console.log("Log sent:", dataToSend);
        } else {
            const errMsg = await res.text();
            console.error(`Log failed: ${res.status} - ${errMsg}`);
            if (res.status === 401) {
                console.warn("Hmm, token expired? Might need to refresh it.");
                // NOTE: Auto-refresh not implemented yet
            }
        }
    } catch (e) {
        console.error("Something went wrong sending log:", e);
    }
}

// Example usage below — testing one at a time to find valid combinations
console.log("Testing basic combinations...");

// Try the most basic possible combinations
sendLog("frontend", "info", "test", "Test message 1");
sendLog("backend", "error", "test", "Test message 2");
sendLog("frontend", "debug", "app", "Test message 3");
sendLog("backend", "warn", "app", "Test message 4");
