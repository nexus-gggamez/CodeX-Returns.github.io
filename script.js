/* Password protection
function checkPassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
        
    // Set the password here
    const correctPassword = "gamz69";
        
    if (password === correctPassword) {
        localStorage.setItem('in', true);
        // Set authentication in session storage with timestamp
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('authTimestamp', Date.now().toString());
            
        // Show page transition
        const transition = document.querySelector('.page-transition');
        transition.classList.add('active');
            
        // Redirect to home page on correct password after transition
        setTimeout(() => {
            window.location.href = "home.html";
        }, 500);
    } else {
        // Show error message on incorrect password
        errorMessage.textContent = "Incorrect password. Please try again.";
        // Add shake animation to input
        const passwordInput = document.getElementById('password');
        passwordInput.classList.add('shake');
            
        // Remove shake class after animation completes
         setTimeout(() => {
            passwordInput.classList.remove('shake');
        }, 500);
            
        // Clear the error message after 3 seconds
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 3000);
    }
}

// Function to verify authentication
function verifyAuth() {
    const authenticated = sessionStorage.getItem('authenticated');
    const authTimestamp = sessionStorage.getItem('authTimestamp');
    const currentTime = Date.now();
    
    // Check if authentication exists and is not expired (30 minute session)
    if (!authenticated || !authTimestamp || currentTime - parseInt(authTimestamp) > 1800000) {
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('authTimestamp');
        window.location.replace("index.html");
        return false;
    }
    return true;
}

Function to open games in a new tab with CodeX Game title */
function openGame(gameUrl) {
        // Create a new window
    const gameWindow = window.open('', '_blank');
    
    // If the window was successfully opened
    if (gameWindow) {
        // Write HTML to the new window that includes an iframe loading the game
        // and sets the title to "CodeX Game"
        gameWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>CodeX Game</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>
                    *, *::before, *::after {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Rajdhani:wght@300;400;500;600;700&display=swap');
                    
                    body, html {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        overflow: hidden;
                        background-color: #000000;
                        font-family: 'Rajdhani', sans-serif;
                    }
                    
                    .game-container {
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                    
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    
                    .loading-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #000000;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        transition: opacity 0.5s ease-out;
                    }
                    
                    .loading-text {
                        color: #ff0022;
                        font-size: 24px;
                        margin-bottom: 20px;
                        font-weight: bold;
                        font-family: 'Audiowide', cursive;
                        letter-spacing: 2px;
                        text-shadow: 0 0 10px rgba(255, 0, 34, 0.7);
                    }
                    
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid rgba(255, 0, 34, 0.3);
                        border-radius: 50%;
                        border-top-color: #ff0022;
                        animation: spin 1s ease-in-out infinite;
                        box-shadow: 0 0 15px rgba(255, 0, 34, 0.5);
                    }
                    
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    
                    .game-header {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        padding: 10px 20px;
                        background-color: rgba(0, 0, 0, 0.9);
                        backdrop-filter: blur(10px);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        z-index: 100;
                        transition: transform 0.3s ease;
                        border-bottom: 1px solid rgba(255, 0, 34, 0.2);
                    }
                    
                    .game-header.hidden {
                        transform: translateY(-100%);
                    }
                    
                    .game-title {
                        color: #ff0022;
                        font-size: 18px;
                        font-weight: bold;
                        font-family: 'Audiowide', cursive;
                        letter-spacing: 1px;
                        text-shadow: 0 0 5px rgba(255, 0, 34, 0.7);
                    }
                    
                    .game-controls {
                        display: flex;
                        gap: 15px;
                    }
                    
                    .control-button {
                        background: none;
                        border: none;
                        color: #f0f0f0;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s;
                        padding: 5px 10px;
                        border-radius: 3px;
                    }
                    
                    .control-button:hover {
                        color: #ff0022;
                        background-color: rgba(255, 0, 34, 0.1);
                    }
                    
                    .show-header-btn {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: #ff0022;
                        border: 1px solid rgba(255, 0, 34, 0.3);
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        z-index: 99;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    
                    .game-container:hover .show-header-btn {
                        opacity: 1;
                    }
                    
                    /* Glitch effect for loading text */
                    @keyframes glitch {
                        0% { transform: translate(0); }
                        20% { transform: translate(-2px, 2px); }
                        40% { transform: translate(-2px, -2px); }
                        60% { transform: translate(2px, 2px); }
                        80% { transform: translate(2px, -2px); }
                        100% { transform: translate(0); }
                    }
                    
                    .loading-text {
                        animation: glitch 1s infinite;
                    }
                </style>
            </head>
            <body>
                <div class="game-container">
                    <div class="game-header" id="gameHeader">
                        <div class="game-title">
                            <i class="fas fa-gamepad"></i> CodeX Game
                        </div>
                        <div class="game-controls">
                            <button class="control-button" onclick="document.querySelector('iframe').requestFullscreen()">
                                <i class="fas fa-expand"></i> Fullscreen
                            </button>
                            <button class="control-button" onclick="window.location.reload()">
                                <i class="fas fa-redo"></i> Reload
                            </button>
                            <button class="control-button" id="hideHeaderBtn">
                                <i class="fas fa-eye-slash"></i> Hide Bar
                            </button>
                            <button class="control-button" onclick="window.close()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                    
                    <button class="show-header-btn" id="showHeaderBtn">
                        <i class="fas fa-eye"></i>
                    </button>
                    
                    <div class="loading-overlay" id="loadingOverlay">
                        <div class="loading-text">LOADING GAME...</div>
                        <div class="spinner"></div>
                    </div>
                    
                    <iframe src="${gameUrl}" allowfullscreen id="gameFrame"></iframe>
                </div>
                
                <script>
                    // Hide loading overlay after the iframe loads
                    document.getElementById('gameFrame').onload = function() {
                        setTimeout(function() {
                            const overlay = document.getElementById('loadingOverlay');
                            overlay.style.opacity = '0';
                            setTimeout(function() {
                                overlay.style.display = 'none';
                            }, 500);
                        }, 1500); // Show loading for at least 1.5 seconds
                    };
                    
                    // Add random glitch effect to game title
                    
                    // Hide/Show header functionality
                    const hideHeaderBtn = document.getElementById('hideHeaderBtn');
                    const showHeaderBtn = document.getElementById('showHeaderBtn');
                    const gameHeader = document.getElementById('gameHeader');
                    
                    hideHeaderBtn.addEventListener('click', function() {
                        gameHeader.classList.add('hidden');
                        showHeaderBtn.style.opacity = '1';
                    });
                    
                    showHeaderBtn.addEventListener('click', function() {
                        gameHeader.classList.remove('hidden');
                        showHeaderBtn.style.opacity = '0';
                    });
                </script>
            </body>
            </html>
        `);
        gameWindow.document.close();
    } else {
        // If popup was blocked, alert the user
        alert('Please allow popups for this website to play games.');
    }
}

// Add the music search functionality
function searchMusic(query) {
    // If no query is provided, get it from the input field
    if (!query) {
        query = document.getElementById('music-search-input').value.trim();
        
        // If input is empty, show alert and return
        if (!query) {
            alert('Please enter a search term');
            return;
        }
    }
    
    // Properly encode the search query
    const encodedQuery = encodeURIComponent(query);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    
    // Open YouTube search in a new tab
    window.open(youtubeSearchUrl, '_blank');
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    /* Check authentication first
    const protectedPages = ['home.html', 'games.html', 'music.html', 'about.html', 'system.html', 'settings.html'];
    const currentPath = window.location.pathname;
    
    // Check if current page is a protected page
    if (protectedPages.some(page => currentPath.endsWith(page) || currentPath.includes(page.replace('.html', '')))) {
        if (!verifyAuth()) {
            return;
        }
        // Refresh auth timestamp on activity
        sessionStorage.setItem('authTimestamp', Date.now().toString());
    }
    
    Apply saved settings to all pages */
    applySavedSettings();
    
    // Add animation class to body
    document.body.classList.add('loaded');
    
    /* Handle password input
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        console.log('Password input found');
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Auto-focus the password input
        passwordInput.focus();
    }
    
    Handle music search functionality */
    const musicSearchButton = document.getElementById('music-search-button');
    const musicSearchInput = document.getElementById('music-search-input');
    
    if (musicSearchButton && musicSearchInput) {
        console.log('Music search elements found');
        
        // Add click event to search button
        musicSearchButton.addEventListener('click', function() {
            console.log('Search button clicked');
            searchMusic();
        });
        
        // Add enter key event to search input
        musicSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search input');
                searchMusic();
            }
        });
    }
    
    // Add page transition effect for all internal links
    const internalLinks = document.querySelectorAll('a[href^="home"], a[href^="games"], a[href^="music"], a[href^="about"], a[href^="system"], a[href^="settings"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const transition = document.querySelector('.page-transition');
            
            /* Verify authentication before navigation
            if (!verifyAuth()) {
                return;
            }*/
            
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
    
    // Add scroll animation for elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.content, .game-card, .about-image, .about-content, .music-search-box, .popular-searches, .category');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once on page load
    animateOnScroll();
    
    // Add parallax effect to hero section if it exists
    const hero = document.querySelector('.hero-bg');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    }
    
    // Add hover effect to game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 0, 34, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add hover effect to music categories
    const categories = document.querySelectorAll('.category');
    if (categories.length > 0) {
        categories.forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 0, 34, 0.2)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Add hover effect to tags
    const tags = document.querySelectorAll('.tag');
    if (tags.length > 0) {
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.3)';
                this.style.background = 'rgba(255, 0, 34, 0.2)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.background = '';
            });
            
            // Add click event to tags for music search
            tag.addEventListener('click', function() {
                const tagText = this.textContent.trim();
                console.log('Tag clicked:', tagText);
                searchMusic(tagText);
            });
        });
    }
    
    // Initialize any music tag search functionality
    const musicTags = document.querySelectorAll('.music-tag');
    if (musicTags.length > 0) {
        console.log('Music tags found:', musicTags.length);
        musicTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const tagText = this.textContent.trim();
                console.log('Music tag clicked:', tagText);
                searchMusic(tagText);
            });
        });
    }
});

// Function to apply saved settings
function applySavedSettings() {
    const savedSettings = localStorage.getItem('codexSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Set page title
        document.title = settings.tabTitle || 'CodeX';
        
        // Set favicon
        const currentFavicon = settings.currentFavicon || 'logo.svg';
        const faviconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        
        if (faviconLinks.length > 0) {
            faviconLinks.forEach(link => {
                link.href = currentFavicon;
            });
        } else {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = currentFavicon;
            document.head.appendChild(link);
        }
    }
}

// Add this to a new file called games.js or to your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the games page
    const gameSearch = document.getElementById('game-search');
    if (!gameSearch) return;
    
    const clearSearchBtn = document.getElementById('clear-search');
    const gameCards = document.querySelectorAll('.game-card'); // Assuming your games are in elements with class 'game-card'
    const noResultsMessage = document.createElement('div');
    
    // Create and add the "no results" message element
    noResultsMessage.className = 'no-results';
    noResultsMessage.innerHTML = '<i class="fas fa-search"></i> No games found. Try a different search term.';
    gameSearch.parentElement.parentElement.after(noResultsMessage);
    
    // Search functionality
    function performSearch() {
        const searchTerm = gameSearch.value.toLowerCase().trim();
        let resultsFound = false;
        
        // Show/hide clear button
        clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
        
        // Reset animation classes
        gameCards.forEach(card => {
            card.classList.remove('search-visible');
        });
        
        // Filter games
        gameCards.forEach((card, index) => {
            // Get game title (assuming it's in an h3 element)
            const gameTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
            // Get game description (assuming it's in a p element)
            const gameDescription = card.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (searchTerm === '' || gameTitle.includes(searchTerm) || gameDescription.includes(searchTerm)) {
                card.style.display = 'block';
                // Add animation with delay based on index
                setTimeout(() => {
                    card.classList.add('search-visible');
                }, index * 50);
                resultsFound = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        noResultsMessage.style.display = resultsFound || !searchTerm ? 'none' : 'block';
    }
    
    // Event listeners
    gameSearch.addEventListener('input', performSearch);
    
    clearSearchBtn.addEventListener('click', function() {
        gameSearch.value = '';
        performSearch();
        gameSearch.focus();
    });
    
    // Initialize search on page load
    performSearch();
});
