// Function to format date and time
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to create a room card
function createRoomCard(reservation) {
    const card = document.createElement('div');
    card.className = 'room-card';

    const header = document.createElement('div');
    header.className = 'room-header';

    const icon = document.createElement('div');
    icon.className = 'room-icon';
    icon.innerHTML = '<i class="fas fa-door-open"></i>';

    const info = document.createElement('div');
    info.className = 'room-info';
    info.innerHTML = `
        <h3>${reservation.room}</h3>
        <span class="status status-${reservation.status.toLowerCase()}">${reservation.status}</span>
    `;

    header.appendChild(icon);
    header.appendChild(info);

    const details = document.createElement('div');
    details.className = 'room-details';
    details.innerHTML = `
        <div class="detail-item">
            <i class="far fa-calendar"></i>
            <span>Date: ${formatDateTime(reservation.reservationDate)}</span>
        </div>
        <div class="detail-item">
            <i class="far fa-clock"></i>
            <span>Time: ${reservation.timeStart} - ${reservation.timeEnd}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>Participants: ${reservation.participantCount}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-clipboard-list"></i>
            <span>Purpose: ${reservation.purpose}</span>
        </div>
    `;

    card.appendChild(header);
    card.appendChild(details);

    return card;
}

// Function to get user identifier
function getUserIdentifier() {
    // Check for regular user ID
    const userId = localStorage.getItem('userId');
    if (userId) return { userId };

    // Check for Google user
    const googleUser = localStorage.getItem('googleUser');
    if (googleUser) {
        try {
            const user = JSON.parse(googleUser);
            return { email: user.email };
        } catch (error) {
            console.error('Error parsing Google user data:', error);
        }
    }

    // Check for regular user email
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) return { email: userEmail };

    return null;
}

// Function to load and display user's reservations
async function loadUserReservations() {
    const container = document.querySelector('.rooms-container');
    if (!container) {
        console.error('Rooms container not found');
        return;
    }

    try {
        const userIdentifier = getUserIdentifier();
        if (!userIdentifier) {
            window.location.href = '../log-in-page/index.html';
            return;
        }

        console.log('User identifier:', userIdentifier); // Debug log

        // Fetch all reservations
        const response = await fetch('http://localhost:3001/api/reservations');
        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        // Handle different response formats
        let reservations = [];
        if (Array.isArray(data)) {
            reservations = data;
        } else if (data.data && Array.isArray(data.data)) {
            reservations = data.data;
        } else {
            console.error('Unexpected response format:', data);
            throw new Error('Invalid response format');
        }

        console.log('All reservations:', reservations); // Debug log
        
        // Filter reservations based on user identifier
        const userReservations = reservations.filter(res => {
            console.log('Checking reservation:', res); // Debug log
            if (userIdentifier.userId && res.userId === userIdentifier.userId) {
                console.log('Matched by userId');
                return true;
            }
            if (userIdentifier.email && res.email && 
                res.email.toLowerCase() === userIdentifier.email.toLowerCase()) {
                console.log('Matched by email');
                return true;
            }
            return false;
        });

        console.log('User reservations:', userReservations); // Debug log

        if (userReservations.length === 0) {
            container.innerHTML = `
                <div class="no-reservations">
                    <i class="fas fa-calendar-times"></i>
                    <p>You have no reservations yet</p>
                </div>`;
            return;
        }

        // Sort reservations by date and status
        userReservations.sort((a, b) => {
            // Sort by status (approved first)
            if (a.status === 'approved' && b.status !== 'approved') return -1;
            if (a.status !== 'approved' && b.status === 'approved') return 1;
            // Then sort by date
            const dateA = new Date(a.date || a.reservationDate);
            const dateB = new Date(b.date || b.reservationDate);
            return dateB - dateA;
        });

        container.innerHTML = userReservations.map(reservation => `
            <div class="room-card" data-id="${reservation._id}">
                <div class="room-header">
                    <div class="room-icon">
                        <i class="fas fa-door-open"></i>
                    </div>
                    <div class="room-info">
                        <h3>Room ${reservation.roomNumber || reservation.room}</h3>
                        <div class="reservation-time">
                            <i class="far fa-clock"></i>
                            <span>${formatDateTime(reservation.date || reservation.reservationDate)}</span>
                        </div>
                    </div>
                </div>
                <div class="room-details">
                    <div class="detail-item">
                        <i class="far fa-clock"></i>
                        <span>Time: ${reservation.startTime || reservation.timeStart} - ${reservation.endTime || reservation.timeEnd}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${reservation.participants || reservation.participantCount} participants</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clipboard-list"></i>
                        <span>${reservation.purpose}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-info-circle"></i>
                        <span class="status-${(reservation.status || '').toLowerCase()}">${reservation.status || 'Pending'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reservations:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load reservations. Please try again later.</p>
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserReservations();
    // Poll for updates every 30 seconds
    setInterval(loadUserReservations, 30000);
}); document.addEventListener('DOMContentLoaded', loadUserReservations); 
