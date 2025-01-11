// Function to format date and time
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Function to format time
function formatTime(timeStr) {
    return timeStr || '';
}

// Function to create a room card
function createRoomCard(reservation) {
    // Format participants list with better structure
    const participantsList = reservation.participants && Array.isArray(reservation.participants)
        ? reservation.participants.map(p => `
            <div class="participant">
                <div class="participant-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="participant-info">
                    <div class="participant-name">${p.name}</div>
                    <div class="participant-id">ID: ${p.id_number}</div>
                </div>
            </div>
        `).join('')
        : '<div class="no-participants">No participants listed</div>';

    return `
        <div class="room-card" data-id="${reservation._id}">
            <div class="room-header">
                <div class="room-icon">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="room-info">
                    <h3>${reservation.roomNumber || reservation.room}</h3>
                    <div class="reservation-time">
                        <i class="far fa-clock"></i>
                        <span>${formatDateTime(reservation.date || reservation.reservationDate)}</span>
                        <br>
                        <span>${formatTime(reservation.startTime || reservation.timeStart)} - ${formatTime(reservation.endTime || reservation.timeEnd)}</span>
                    </div>
                </div>
            </div>
            <div class="room-details">
                <div class="detail-item">
                    <i class="fas fa-user"></i>
                    <span>Reserved by: ${reservation.name}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${reservation.email || 'No email provided'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Purpose: ${reservation.purpose || 'Not specified'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-info-circle"></i>
                    <span class="status-${reservation.status || 'pending'}">Status: ${reservation.status || 'pending'}</span>
                </div>
                <div class="participants-section">
                    <div class="participants-title">
                        <div class="participants-header">
                            <i class="fas fa-users"></i>
                            <span>Participants</span>
                            <span class="participants-count">${reservation.participantCount || (reservation.participants ? reservation.participants.length : 0)}</span>
                        </div>
                    </div>
                    <div class="participants-list">
                        ${participantsList}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to load and display approved reservations
async function loadApprovedReservations() {
    const container = document.querySelector('.rooms-container');
    if (!container) {
        console.error('Rooms container not found');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/reservations');
        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        const reservations = Array.isArray(data) ? data : (data.data || []);
        const approvedReservations = reservations.filter(res => res.status === 'approved');

        if (approvedReservations.length === 0) {
            container.innerHTML = `
                <div class="no-reservations">
                    <i class="fas fa-calendar-times"></i>
                    <p>No approved reservations found</p>
                </div>`;
            return;
        }

        // Sort reservations by date and time
        approvedReservations.sort((a, b) => {
            const dateA = new Date(a.date || a.reservationDate);
            const dateB = new Date(b.date || b.reservationDate);
            return dateA - dateB;
        });

        container.innerHTML = approvedReservations.map(reservation => 
            createRoomCard(reservation)
        ).join('');

    } catch (error) {
        console.error('Error loading reservations:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load reservations. Please try again later.</p>
                <small>${error.message}</small>
            </div>`;
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.room-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Start polling for updates
let pollInterval;

function startPolling() {
    // Poll every 30 seconds
    pollInterval = setInterval(loadApprovedReservations, 30000);
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadApprovedReservations();
    setupSearch();
    startPolling();
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopPolling();
    } else {
        loadApprovedReservations();
        startPolling();
    }
}); 