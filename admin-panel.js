// Admin panel functionality
(function() {
    // Check if current user is admin
    function isAdmin() {
        return localStorage.getItem('isAdmin') === 'true';
    }
    
    // Check if admin panel should be shown
    function shouldShowAdminPanel() {
        return localStorage.getItem('showAdminPanel') === 'true';
    }

    // Function to create admin panel
    function createAdminPanel() {
        if (!isAdmin()) return;
        
        // Check if admin panel already exists
        if (document.querySelector('.admin-panel')) {
            return;
        }
        
        const adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        
        // Add hidden class if panel should be hidden
        if (!shouldShowAdminPanel()) {
            adminPanel.classList.add('admin-panel-hidden');
        }
        
        adminPanel.innerHTML = `
            <div class="admin-panel-header">
                <h3>Admin Panel</h3>
                <button id="close-admin-panel"><i class="fas fa-times"></i></button>
            </div>
            <div class="admin-panel-content">
                <div class="admin-section">
                    <h4>User Management</h4>
                    <div class="user-list-container">
                        <div class="user-list" id="user-list"></div>
                    </div>
                </div>
                <div class="admin-section">
                    <h4>Banned Users</h4>
                    <div class="banned-list-container">
                        <div class="banned-list" id="banned-list"></div>
                    </div>
                </div>
                <div class="admin-section">
                    <h4>Admin Controls</h4>
                    <button id="refresh-user-list" class="admin-button">Refresh User List</button>
                    <button id="logout-admin" class="admin-button">Logout Admin</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
        
        // Add event listeners
        document.getElementById('close-admin-panel').addEventListener('click', () => {
            adminPanel.classList.add('admin-panel-hidden');
            localStorage.setItem('showAdminPanel', 'false');
        });
        
        document.getElementById('refresh-user-list').addEventListener('click', () => {
            loadUserData();
        });
        
        document.getElementById('logout-admin').addEventListener('click', () => {
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('showAdminPanel');
            adminPanel.remove();
            alert('Admin logged out successfully');
        });
        
        // Load user data
        loadUserData();
    }
    
    // Function to load user data into admin panel
    function loadUserData() {
        const userList = document.getElementById('user-list');
        const bannedList = document.getElementById('banned-list');
        
        if (!userList || !bannedList) return;
        
        // Clear existing content
        userList.innerHTML = '';
        bannedList.innerHTML = '';
        
        // Get user data
        const users = window.adminGetUserList();
        const bannedUsers = window.adminGetBannedUsers();
        const currentUserFingerprint = window.getCurrentUserFingerprint();
        
        // Populate user list
        Object.keys(users).forEach(fingerprint => {
            const userData = users[fingerprint];
            const lastVisit = new Date(userData.visits[userData.visits.length - 1]).toLocaleString();
            const visitCount = userData.visits.length;
            const isCurrentUser = fingerprint === currentUserFingerprint;
            const isBanned = bannedUsers.includes(fingerprint);
            const username = userData.username || 'Unknown User';
            
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-id">
                        <span class="user-nickname">${username}</span>
                        ${isCurrentUser ? ' <span class="current-user-badge">You</span>' : ''}
                    </div>
                    <div class="user-visit-info">Last visit: ${lastVisit} (${visitCount} visits)</div>
                    <div class="user-fingerprint">${fingerprint.substring(0, 15)}...</div>
                </div>
                <div class="user-actions">
                    <button class="ban-user-btn ${isBanned ? 'unban-btn' : 'ban-btn'}" data-fingerprint="${fingerprint}">
                        ${isBanned ? 'Unban' : 'Ban'}
                    </button>
                </div>
            `;
            
            userList.appendChild(userItem);
            
            // Add event listener to ban button
            userItem.querySelector('.ban-user-btn').addEventListener('click', (e) => {
                const fingerprint = e.target.dataset.fingerprint;
                if (bannedUsers.includes(fingerprint)) {
                    window.adminUnbanUser(fingerprint);
                    e.target.textContent = 'Ban';
                    e.target.classList.remove('unban-btn');
                    e.target.classList.add('ban-btn');
                } else {
                    if (confirm(`Are you sure you want to ban ${username}?`)) {
                        window.adminBanUser(fingerprint);
                        e.target.textContent = 'Unban';
                        e.target.classList.remove('ban-btn');
                        e.target.classList.add('unban-btn');
                    }
                }
                
                // Reload banned users list
                loadUserData();
            });
        });
        
        // Populate banned users list
        if (bannedUsers.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-list-message';
            emptyMessage.textContent = 'No banned users';
            bannedList.appendChild(emptyMessage);
        } else {
            bannedUsers.forEach(fingerprint => {
                const userData = users[fingerprint] || { username: 'Unknown User' };
                const username = userData.username || 'Unknown User';
                
                const bannedItem = document.createElement('div');
                bannedItem.className = 'banned-item';
                bannedItem.innerHTML = `
                    <div class="banned-user-info">
                        <div class="banned-user-id">${username}</div>
                        <div class="banned-user-fingerprint">${fingerprint.substring(0, 15)}...</div>
                    </div>
                    <button class="unban-user-btn" data-fingerprint="${fingerprint}">Unban</button>
                `;
                
                bannedList.appendChild(bannedItem);
                
                // Add event listener to unban button
                bannedItem.querySelector('.unban-user-btn').addEventListener('click', (e) => {
                    const fingerprint = e.target.dataset.fingerprint;
                    window.adminUnbanUser(fingerprint);
                    
                    // Reload lists
                    loadUserData();
                });
            });
        }
    }
    
    // Toggle admin panel visibility
    function toggleAdminPanel() {
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) {
            adminPanel.classList.toggle('admin-panel-hidden');
            localStorage.setItem('showAdminPanel', !adminPanel.classList.contains('admin-panel-hidden'));
        }
    }
    
    // Initialize admin functionality
    function initAdmin() {
        // Add admin login functionality (Ctrl+Shift+L)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                const password = prompt('Enter admin password:');
                if (password === 'admin123') { // Change this to a secure password
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('showAdminPanel', 'true');
                    alert('Admin access granted. Press Ctrl+Shift+A to toggle admin panel.');
                    createAdminPanel();
                }
            }
            
            // Toggle admin panel with Ctrl+Shift+A
            if (e.ctrlKey && e.shiftKey && e.key === 'A' && isAdmin()) {
                toggleAdminPanel();
            }
        });
        
        // Create admin panel if user is admin
        if (isAdmin()) {
            createAdminPanel();
        }
    }
    
    // Run when page loads
    window.addEventListener('DOMContentLoaded', initAdmin);
})();
