// Settings functionality
function saveSettings() {
    // Get values from form
    const tabTitle = document.getElementById('tab-title').value;
    const selectedFavicon = document.querySelector('input[name="favicon"]:checked').value;
    
    // Create settings object
    const settings = {
        tabTitle: tabTitle,
        currentFavicon: selectedFavicon
    };
    
    // Save to localStorage
    localStorage.setItem('codexSettings', JSON.stringify(settings));
    
    // Show success message
    const successMessage = document.getElementById('settings-success');
    successMessage.textContent = "Settings saved successfully!";
    
    // Apply settings immediately
    applySavedSettings();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
        successMessage.textContent = "";
    }, 3000);
}

// Reset settings to default
function resetSettings() {
    // Default settings
    const defaultSettings = {
        tabTitle: 'CodeX',
        currentFavicon: 'logo.svg'
    };
    
    // Save default settings
    localStorage.setItem('codexSettings', JSON.stringify(defaultSettings));
    
    // Update form with default values
    document.getElementById('tab-title').value = defaultSettings.tabTitle;
    document.querySelector(`input[value="${defaultSettings.currentFavicon}"]`).checked = true;
    
    // Apply settings
    applySavedSettings();
    
    // Show success message
    const successMessage = document.getElementById('settings-success');
    successMessage.textContent = "Settings reset to default!";
    
    // Clear success message after 3 seconds
    setTimeout(() => {
        successMessage.textContent = "";
    }, 3000);
}

// Load saved settings into the form
function loadSavedSettingsIntoForm() {
    const savedSettings = localStorage.getItem('codexSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Set form values
        document.getElementById('tab-title').value = settings.tabTitle || 'CodeX';
        
        // Set favicon radio button
        const faviconInput = document.querySelector(`input[value="${settings.currentFavicon}"]`);
        if (faviconInput) {
            faviconInput.checked = true;
        } else {
            // Default to logo.svg if saved favicon not found in options
            document.querySelector('input[value="logo.svg"]').checked = true;
        }
    }
}

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the settings page
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        // Load saved settings into form
        loadSavedSettingsIntoForm();
        
        // Add event listeners for save and reset buttons
        document.getElementById('save-settings').addEventListener('click', function(e) {
            e.preventDefault();
            saveSettings();
        });
        
        document.getElementById('reset-settings').addEventListener('click', function(e) {
            e.preventDefault();
            resetSettings();
        });
        
        // Preview functionality for tab title
        document.getElementById('tab-title').addEventListener('input', function() {
            document.getElementById('title-preview').textContent = this.value || 'CodeX';
        });
        
        // Preview functionality for favicon
        const faviconInputs = document.querySelectorAll('input[name="favicon"]');
        faviconInputs.forEach(input => {
            input.addEventListener('change', function() {
                document.getElementById('favicon-preview').src = this.value;
            });
        });
    }
});

// Add this to your settings.js file
document.addEventListener('DOMContentLoaded', function() {
    // Force favicon images to be consistent size
    const faviconImages = document.querySelectorAll('.favicon-option label img, #favicon-preview');
    
    faviconImages.forEach(img => {
        img.onload = function() {
            // For preview favicon
            if (img.id === 'favicon-preview') {
                img.style.width = '16px';
                img.style.height = '16px';
            } 
            // For option favicons
            else {
                img.style.width = '32px';
                img.style.height = '32px';
            }
            img.style.objectFit = 'contain';
        };
        
        // Apply styles immediately for already loaded images
        if (img.complete) {
            if (img.id === 'favicon-preview') {
                img.style.width = '16px';
                img.style.height = '16px';
            } else {
                img.style.width = '32px';
                img.style.height = '32px';
            }
            img.style.objectFit = 'contain';
        }
    });
});


// Add this to your settings.js file
document.addEventListener('DOMContentLoaded', function() {
    // Force favicon images to be consistent size
    const faviconImages = document.querySelectorAll('.favicon-option label img, #favicon-preview');
    
    faviconImages.forEach(img => {
        img.onload = function() {
            img.style.width = '32px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';
        };
        
        // Apply styles immediately for already loaded images
        if (img.complete) {
            img.style.width = '32px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';
        }
    });
});
