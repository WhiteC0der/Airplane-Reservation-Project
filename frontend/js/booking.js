/**
 * Booking Module - Booking creation and management
 */

let currentBooking = null;

/**
 * Handle booking form submission
 */
async function handleBooking(event) {
    event.preventDefault();

    if (!isAuthenticated()) {
        alert('Please login to make a booking');
        showPage('auth');
        return;
    }

    if (!currentFlight) {
        alert('Please select a flight first');
        return;
    }

    const seatNumber = document.getElementById('seatNumber').value.toUpperCase();
    const errorDiv = document.getElementById('bookingError');
    errorDiv.classList.remove('show');

    // Validate seat number format
    if (!/^[A-Z]\d+$/.test(seatNumber)) {
        errorDiv.textContent = 'Invalid seat number format (e.g., A1, B12)';
        errorDiv.classList.add('show');
        return;
    }

    try {
        console.log('Creating booking with data:', {
            flightId: currentFlight.flightId,
            seatNumber: seatNumber
        });

        const response = await createBooking({
            flightId: currentFlight.flightId,
            seatNumber: seatNumber
        });

        console.log('Booking created successfully:', response);
        currentBooking = response.data;

        // Show confirmation page
        displayConfirmation(currentBooking);
        showPage('confirmation');
    } catch (error) {
        console.error('Booking error:', error);
        errorDiv.textContent = error.message || 'Failed to create booking. Please try again.';
        errorDiv.classList.add('show');
    }
}

/**
 * Display booking confirmation
 */
function displayConfirmation(booking) {
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <div class="confirmation-item">
            <span class="confirmation-label">Booking ID:</span>
            <span class="confirmation-value">#${booking.bookingId}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Flight Number:</span>
            <span class="confirmation-value">${booking.flightNumber}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Airline:</span>
            <span class="confirmation-value">${booking.airlineName}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Route:</span>
            <span class="confirmation-value">${booking.departureCity} → ${booking.arrivalCity}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Departure:</span>
            <span class="confirmation-value">${formatDateTime(booking.departureTime)}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Arrival:</span>
            <span class="confirmation-value">${formatDateTime(booking.arrivalTime)}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Seat Number:</span>
            <span class="confirmation-value">${booking.seatNumber}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Total Price:</span>
            <span class="confirmation-value">$${booking.totalPrice.toFixed(2)}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Status:</span>
            <span class="confirmation-value">${booking.bookingStatus}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Booking Date:</span>
            <span class="confirmation-value">${formatDateTime(booking.bookingDate)}</span>
        </div>
    `;
}

/**
 * Load and display user bookings
 */
async function loadUserBookings() {
    try {
        if (!isAuthenticated()) {
            document.getElementById('bookingsList').innerHTML = 
                '<p style="text-align: center; color: #999;">Please login to view your bookings</p>';
            return;
        }

        const response = await getUserBookings();
        displayUserBookings(response.data);
    } catch (error) {
        showBookingsError(error.message);
    }
}

/**
 * Display user bookings
 */
function displayUserBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align: center; color: #999;">No bookings found</p>';
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-item-header">
                <div>
                    <h3>${booking.flightNumber} - ${booking.airlineName}</h3>
                    <p style="color: #666; font-size: 0.9rem;">Booking ID: #${booking.bookingId}</p>
                </div>
                <span class="booking-status ${booking.bookingStatus.toLowerCase()}">
                    ${booking.bookingStatus}
                </span>
            </div>

            <div class="booking-item-details">
                <div class="detail-item">
                    <div class="detail-label">Route</div>
                    <div class="detail-value">${booking.departureCity} → ${booking.arrivalCity}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Departure</div>
                    <div class="detail-value">${formatDateTime(booking.departureTime)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Seat</div>
                    <div class="detail-value">${booking.seatNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Price</div>
                    <div class="detail-value">$${booking.totalPrice.toFixed(2)}</div>
                </div>
            </div>

            <div class="booking-item-actions">
                ${booking.bookingStatus === 'CONFIRMED' ? `
                    <button class="btn btn-danger" onclick="cancelUserBooking(${booking.bookingId})">
                        Cancel Booking
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="viewBookingDetails(${booking.bookingId})">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Cancel a booking
 */
async function cancelUserBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully');
        loadUserBookings();
    } catch (error) {
        alert('Error cancelling booking: ' + error.message);
    }
}

/**
 * View booking details
 */
async function viewBookingDetails(bookingId) {
    try {
        const response = await getBookingById(bookingId);
        const booking = response.data;

        alert(`
Booking Details:
Flight: ${booking.flightNumber}
Route: ${booking.departureCity} → ${booking.arrivalCity}
Departure: ${formatDateTime(booking.departureTime)}
Seat: ${booking.seatNumber}
Price: $${booking.totalPrice.toFixed(2)}
Status: ${booking.bookingStatus}
        `);
    } catch (error) {
        alert('Error loading booking details: ' + error.message);
    }
}

/**
 * Show bookings error message
 */
function showBookingsError(message) {
    const errorDiv = document.getElementById('bookingsError');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Initialize bookings page
 */
function initializeBookings() {
    loadUserBookings();
}
