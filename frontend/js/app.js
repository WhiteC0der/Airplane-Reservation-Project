/**
 * Main Application Module - Page navigation and initialization
 */

/**
 * Show a specific page and hide others
 */
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');

        // Initialize page-specific content
        switch (pageId) {
            case 'flights':
                initializeFlights();
                break;
            case 'bookings':
                initializeBookings();
                break;
            case 'profile':
                initializeProfile();
                break;
        }
    }
}

/**
 * Initialize profile page
 */
async function initializeProfile() {
    if (!isAuthenticated()) {
        alert('Please login to view your profile');
        showPage('auth');
        return;
    }

    try {
        const response = await getUserProfile();
        const user = response.data;

        // Display profile information
        const profileInfo = document.getElementById('profileInfo');
        profileInfo.innerHTML = `
            <div class="profile-info-item">
                <span class="confirmation-label">Username:</span>
                <span class="confirmation-value">${user.username}</span>
            </div>
            <div class="profile-info-item">
                <span class="confirmation-label">Email:</span>
                <span class="confirmation-value">${user.email}</span>
            </div>
            <div class="profile-info-item">
                <span class="confirmation-label">First Name:</span>
                <span class="confirmation-value">${user.firstName || 'Not set'}</span>
            </div>
            <div class="profile-info-item">
                <span class="confirmation-label">Last Name:</span>
                <span class="confirmation-value">${user.lastName || 'Not set'}</span>
            </div>
            <div class="profile-info-item">
                <span class="confirmation-label">Phone:</span>
                <span class="confirmation-value">${user.phoneNumber || 'Not set'}</span>
            </div>
            <div class="profile-info-item">
                <span class="confirmation-label">Member Since:</span>
                <span class="confirmation-value">${formatDateTime(user.createdAt)}</span>
            </div>
        `;

        // Populate form fields
        document.getElementById('profileFirstName').value = user.firstName || '';
        document.getElementById('profileLastName').value = user.lastName || '';
        document.getElementById('profilePhone').value = user.phoneNumber || '';
    } catch (error) {
        const errorDiv = document.getElementById('profileError');
        errorDiv.textContent = 'Error loading profile: ' + error.message;
        errorDiv.classList.add('show');
    }
}

/**
 * Handle profile update
 */
async function handleProfileUpdate(event) {
    event.preventDefault();

    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const phoneNumber = document.getElementById('profilePhone').value;

    const errorDiv = document.getElementById('profileError');
    errorDiv.classList.remove('show');

    try {
        const response = await updateUserProfile({
            firstName,
            lastName,
            phoneNumber
        });

        alert('Profile updated successfully');
        initializeProfile();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

/**
 * Initialize application on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Flight Booking System - Frontend Initialized');

    // Initialize authentication UI
    initializeAuth();

    // Show home page by default
    showPage('home');

    // Log API base URL
    console.log('API Base URL:', 'http://localhost:3000/api');
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Refresh data if needed
        if (isAuthenticated()) {
            initializeAuth();
        }
    }
});

/**
 * Handle window unload
 */
window.addEventListener('beforeunload', function() {
    // Could save state here if needed
});
