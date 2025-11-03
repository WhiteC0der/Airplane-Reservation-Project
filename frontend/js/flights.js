/**
 * Flights Module - Flight search and display
 */

let currentFlight = null;

/**
 * Load and display all flights
 */
async function loadAllFlights() {
    try {
        const response = await getAllFlights();
        displayFlights(response.data);
    } catch (error) {
        showFlightsError(error.message);
    }
}

/**
 * Search flights based on criteria
 */
async function handleSearchFlights() {
    const departureCity = document.getElementById('departureCity').value;
    const arrivalCity = document.getElementById('arrivalCity').value;
    const departureDate = document.getElementById('departureDate').value;

    const errorDiv = document.getElementById('flightsError');
    errorDiv.classList.remove('show');

    if (!departureCity || !arrivalCity) {
        errorDiv.textContent = 'Please enter both departure and arrival cities';
        errorDiv.classList.add('show');
        return;
    }

    try {
        const searchCriteria = {
            departureCity,
            arrivalCity
        };

        if (departureDate) {
            searchCriteria.departureDate = departureDate;
        }

        const response = await searchFlights(searchCriteria);
        displayFlights(response.data);
    } catch (error) {
        showFlightsError(error.message);
    }
}

/**
 * Display flights in the UI
 */
function displayFlights(flights) {
    const flightsList = document.getElementById('flightsList');

    if (flights.length === 0) {
        flightsList.innerHTML = '<p style="text-align: center; color: #999;">No flights found</p>';
        return;
    }

    flightsList.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div class="flight-header">
                <span class="flight-number">${flight.flightNumber}</span>
                <span class="flight-price">$${flight.price.toFixed(2)}</span>
            </div>
            
            <div class="flight-route">
                <div>
                    <div class="flight-city">${flight.departureCity}</div>
                    <div class="flight-time">${formatTime(flight.departureTime)}</div>
                </div>
                <div class="flight-arrow">→</div>
                <div>
                    <div class="flight-city">${flight.arrivalCity}</div>
                    <div class="flight-time">${formatTime(flight.arrivalTime)}</div>
                </div>
            </div>

            <div class="flight-details">
                <div class="detail-item">
                    <div class="detail-label">Airline</div>
                    <div class="detail-value">${flight.airlineName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Available Seats</div>
                    <div class="detail-value">${flight.availableSeats}/${flight.totalSeats}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">${flight.status}</div>
                </div>
            </div>

            <div class="flight-actions">
                ${isAuthenticated() && flight.availableSeats > 0 ? `
                    <button class="btn btn-primary" onclick="selectFlight(${flight.flightId})">
                        Book Now
                    </button>
                ` : flight.availableSeats === 0 ? `
                    <button class="btn btn-secondary" disabled>
                        No Seats Available
                    </button>
                ` : `
                    <button class="btn btn-secondary" onclick="showPage('auth')">
                        Login to Book
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

/**
 * Select a flight for booking
 */
async function selectFlight(flightId) {
    try {
        const response = await getFlightById(flightId);
        currentFlight = response.data;

        // Display flight details on booking page
        const bookingDetails = document.getElementById('bookingDetails');
        bookingDetails.innerHTML = `
            <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px;">
                <h3>${currentFlight.flightNumber} - ${currentFlight.airlineName}</h3>
                <p><strong>Route:</strong> ${currentFlight.departureCity} → ${currentFlight.arrivalCity}</p>
                <p><strong>Departure:</strong> ${formatDateTime(currentFlight.departureTime)}</p>
                <p><strong>Arrival:</strong> ${formatDateTime(currentFlight.arrivalTime)}</p>
                <p><strong>Price:</strong> $${currentFlight.price.toFixed(2)}</p>
                <p><strong>Available Seats:</strong> ${currentFlight.availableSeats}</p>
            </div>
        `;

        // Clear seat input
        document.getElementById('seatNumber').value = '';
        document.getElementById('bookingError').classList.remove('show');

        // Show booking page
        showPage('booking');
    } catch (error) {
        alert('Error loading flight details: ' + error.message);
    }
}

/**
 * Show flights error message
 */
function showFlightsError(message) {
    const errorDiv = document.getElementById('flightsError');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Format time for display
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date and time for display
 */
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Initialize flights page
 */
function initializeFlights() {
    loadAllFlights();
}
