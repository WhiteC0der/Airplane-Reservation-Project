/**
 * Debug Script - Check Authentication Status
 * Run this in the browser console to debug authentication issues
 */

console.log('='.repeat(80));
console.log('FLIGHT BOOKING SYSTEM - DEBUG INFORMATION');
console.log('='.repeat(80));

// 1. Check if token exists
const token = localStorage.getItem('authToken');
console.log('\n1. TOKEN STATUS:');
console.log('   Token exists:', token ? 'YES' : 'NO');
if (token) {
    console.log('   Token length:', token.length);
    console.log('   Token preview:', token.substring(0, 50) + '...');
    
    // Decode JWT token (without verification)
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('   Token payload:', payload);
            console.log('   User ID:', payload.userId);
            console.log('   Username:', payload.username);
            console.log('   Email:', payload.email);
            
            // Check expiration
            if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                const now = new Date();
                const isExpired = now > expDate;
                console.log('   Expires:', expDate.toLocaleString());
                console.log('   Is Expired:', isExpired ? 'YES ⚠️' : 'NO ✓');
            }
        }
    } catch (e) {
        console.error('   Error decoding token:', e.message);
    }
}

// 2. Check user data
const userData = localStorage.getItem('userData');
console.log('\n2. USER DATA:');
console.log('   User data exists:', userData ? 'YES' : 'NO');
if (userData) {
    try {
        const user = JSON.parse(userData);
        console.log('   User object:', user);
    } catch (e) {
        console.error('   Error parsing user data:', e.message);
    }
}

// 3. Check API connection
console.log('\n3. API CONNECTION:');
console.log('   API Base URL:', API_BASE_URL || 'http://localhost:3000/api');

// 4. Test authentication
console.log('\n4. TESTING AUTHENTICATION:');
if (token) {
    fetch('http://localhost:3000/api/users/profile', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('   Profile API Status:', response.status, response.statusText);
        return response.json();
    })
    .then(data => {
        console.log('   Profile API Response:', data);
        if (data.success) {
            console.log('   ✓ Authentication is working!');
            console.log('   Current User:', data.data);
        } else {
            console.log('   ✗ Authentication failed:', data.message);
        }
    })
    .catch(error => {
        console.error('   ✗ Profile API Error:', error.message);
    });
} else {
    console.log('   ✗ No token available - user not logged in');
}

// 5. Recommendations
console.log('\n5. RECOMMENDATIONS:');
if (!token) {
    console.log('   ⚠️ You need to login first!');
    console.log('   Action: Click "Login" and sign in with your credentials');
} else {
    console.log('   ✓ Token found - checking validity...');
}

console.log('\n' + '='.repeat(80));
console.log('To run this debug script again, type: debugAuth()');
console.log('='.repeat(80));

// Make it available as a function
window.debugAuth = function() {
    console.clear();
    eval(document.querySelector('script[src*="debug-auth.js"]').textContent);
};
