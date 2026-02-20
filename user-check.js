// User identification and ban system
(function() {
    // Function to try to get Windows username
    async function tryGetWindowsUsername() {
        // This is a best-effort attempt to get a username that might correlate with Windows username
        
        // Try to get username from browser if available
        if (navigator.userAgent.includes('Windows')) {
            // Try to extract username from various sources
            
            // Method 1: Try to get from localStorage if previously detected
            const storedUsername = localStorage.getItem('detectedUsername');
            if (storedUsername) {
                return storedUsername;
            }
            
            // Method 2: Try to use experimental getUserMedia to get device name
            // This might contain username on some Windows configurations
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                for (const device of devices) {
                    const label = device.label.toLowerCase();
                    if (label.includes('webcam') || label.includes('camera') || label.includes('microphone')) {
                        // Extract potential username from device label
                        const parts = label.split(' ');
                        for (const part of parts) {
                            // Look for parts that might be usernames (not generic terms)
                            if (part.length > 2 && 
                                !['default', 'webcam', 'camera', 'mic', 'microphone', 'audio', 'video', 'device'].includes(part)) {
                                localStorage.setItem('detectedUsername', part.toUpperCase());
                                return part.toUpperCase();
                            }
                        }
                    }
                }
            } catch (e) {
                console.log("Could not access media devices");
            }
            
            // Method 3: Try to extract from document.cookie if available
            try {
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    if (cookie.includes('username=')) {
                        const username = cookie.split('=')[1].trim();
                        localStorage.setItem('detectedUsername', username.toUpperCase());
                        return username.toUpperCase();
                    }
                }
            } catch (e) {
                console.log("Could not extract from cookies");
            }
        }
        
        // Fallback: Generate a random username that looks like a Windows username
        const randomNames = ['JOHN', 'ALEX', 'SARAH', 'MIKE', 'EMMA', 'DAVID', 'LISA', 'MARK', 'ANNA', 'JAMES'];
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        localStorage.setItem('detectedUsername', randomName);
        return randomName;
    }

    // Function to get user fingerprint
    function getUserFingerprint() {
        // Use FingerprintJS-style approach for more consistent identification
        const userAgentData = navigator.userAgent;
        const browserInfo = navigator.platform;
        const languageInfo = navigator.language;
        const screenInfo = `${window.screen.width}x${window.screen.height}`;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const colorDepth = window.screen.colorDepth;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Create a fingerprint from available system information
        const fingerprint = btoa(
            `${userAgentData}|${browserInfo}|${languageInfo}|${screenInfo}|${timeZone}|${colorDepth}|${pixelRatio}`
        ).replace(/=/g, '');
        
        return fingerprint;
    }

    // Function to check if user is banned
    function checkIfBanned(fingerprint) {
        // Get banned users from localStorage
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];
        return bannedUsers.includes(fingerprint);
    }

    // Function to handle banned user
    function handleBannedUser() {
        document.body.innerHTML = '';
        document.body.style.backgroundColor = 'var(--darker)';
        document.body.style.color = 'var(--primary)';
        document.body.style.fontFamily = 'Audiowide, cursive';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.height = '100vh';
        document.body.style.textAlign = 'center';
        
        const banMessage = document.createElement('div');
        banMessage.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem; text-shadow: 0 0 10px var(--primary);">ACCESS DENIED</h1>
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Your access to this site has been revoked.</p>
            <p style="font-size: 1rem; color: var(--text-muted);">Contact the administrator if you believe this is an error.</p>
        `;
        document.body.appendChild(banMessage);
    }

    // Function to log user visit
    async function logUserVisit(fingerprint) {
        // Try to get Windows username
        const username = await tryGetWindowsUsername();
        
        // Store visit in localStorage for admin to review
        const userVisits = JSON.parse(localStorage.getItem('userVisits')) || {};
        userVisits[fingerprint] = userVisits[fingerprint] || {
            visits: [],
            username: username
        };
        
        userVisits[fingerprint].visits.push(new Date().toISOString());
        
        // Keep only the last 10 visits
        if (userVisits[fingerprint].visits.length > 10) {
            userVisits[fingerprint].visits = userVisits[fingerprint].visits.slice(-10);
        }
        
        localStorage.setItem('userVisits', JSON.stringify(userVisits));
    }

    // Main function to check user on page load
    async function checkUser() {
        const fingerprint = getUserFingerprint();
        
        if (checkIfBanned(fingerprint)) {
            handleBannedUser();
            return false;
        } else {
            await logUserVisit(fingerprint);
            return true;
        }
    }

    // Run check when page loads
    window.addEventListener('DOMContentLoaded', checkUser);
    
    // Expose admin functions to window object
    window.adminBanUser = function(fingerprint) {
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];
        if (!bannedUsers.includes(fingerprint)) {
            bannedUsers.push(fingerprint);
            localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
            
            // If banning current user, refresh page to show ban message
            if (fingerprint === getUserFingerprint()) {
                window.location.reload();
            }
            return true;
        }
        return false;
    };
    
    window.adminUnbanUser = function(fingerprint) {
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];
        const index = bannedUsers.indexOf(fingerprint);
        if (index > -1) {
            bannedUsers.splice(index, 1);
            localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
            return true;
        }
        return false;
    };
    
    window.adminGetUserList = function() {
        return JSON.parse(localStorage.getItem('userVisits')) || {};
    };
    
    window.adminGetBannedUsers = function() {
        return JSON.parse(localStorage.getItem('bannedUsers')) || [];
    };
    
    // Get current user fingerprint
    window.getCurrentUserFingerprint = function() {
        return getUserFingerprint();
    };
})();
