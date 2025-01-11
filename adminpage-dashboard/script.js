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

// Function to create a request card
function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.dataset.id = request._id;
    card.dataset.userId = request.userId;

    const header = document.createElement('div');
    header.className = 'request-header';

    const icon = document.createElement('div');
    icon.className = 'request-icon';
    icon.innerHTML = '<i class="fas fa-door-open"></i>';

    const info = document.createElement('div');
    info.className = 'request-info';
    info.innerHTML = `
        <h3>${request.room}</h3>
        <span class="status status-${request.status.toLowerCase()}">${request.status}</span>
    `;

    header.appendChild(icon);
    header.appendChild(info);

    const details = document.createElement('div');
    details.className = 'request-details';
    details.innerHTML = `
        <div class="detail-item">
            <i class="fas fa-user"></i>
            <span>Requester: ${request.name} </span>
        </div>
        <div class="detail-item">
            <i class="far fa-calendar"></i>
            <span>Date: ${formatDateTime(request.reservationDate)}</span>
        </div>
        <div class="detail-item">
            <i class="far fa-clock"></i>
            <span>Time: ${request.timeStart} - ${request.timeEnd}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>Participants: ${request.participantCount}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-clipboard-list"></i>
            <span>Purpose: ${request.purpose}</span>
        </div>
    `;

    const actions = document.createElement('div');
    actions.className = 'request-actions';

    if (request.status === 'pending') {
        actions.innerHTML = `
            <button class="approve-btn" onclick="handleAction('${request._id}', 'approved', '${request.userId}')">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="reject-btn" onclick="handleAction('${request._id}', 'rejected', '${request.userId}')">
                <i class="fas fa-times"></i> Reject
            </button>
        `;
    }

    card.appendChild(header);
    card.appendChild(details);
    card.appendChild(actions);

    return card;
}

// Function to handle approve/reject actions
async function handleAction(requestId, status, userId) {
    try {
        const response = await fetch(`http://localhost:3001/api/reservations/${requestId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                alert('Cannot approve this reservation: There is a scheduling conflict with another approved reservation.');
            } else {
                alert(result.message || 'Failed to update reservation status');
            }
            return;
        }

        // Refresh the requests display
        loadRequests();
        
        // Show success message
        alert(`Reservation has been ${status} successfully`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update request status. Please try again.');
    }
}

// Function to load and display requests
async function loadRequests() {
    try {
        const container = document.querySelector('.requests-container');
        if (!container) {
            console.error('Could not find requests container element');
            return;
        }

        const response = await fetch('http://localhost:3001/api/reservations');
        if (!response.ok) {
            throw new Error('Failed to fetch requests');
        }

        const result = await response.json();
        const requests = result.data;
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="no-requests">
                    <i class="fas fa-info-circle"></i>
                    <p>No reservation requests found.</p>
                </div>
            `;
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Sort requests: pending first, then by date
        requests.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.reservationDate) - new Date(a.reservationDate);
        });

        // Add each request card
        requests.forEach(request => {
            const card = createRequestCard(request);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading requests:', error);
        const container = document.querySelector('.requests-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load requests. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Search functionality
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.request-card');

        cards.forEach(card => {
            // Get the requester name and ID from the card
            const requesterInfo = card.querySelector('.detail-item:first-child span').textContent;
            const requesterName = requesterInfo.split(': ')[1].toLowerCase();
            const requesterId = card.dataset.userId || ''; // Get user ID from dataset

            // Check if search term matches either name or ID
            const isMatch = requesterName.includes(searchTerm) || requesterId.toLowerCase().includes(searchTerm);
            
            // Show/hide card based on match
            card.style.display = isMatch ? 'block' : 'none';
        });

        // Show message if no results found
        const visibleCards = document.querySelectorAll('.request-card[style="display: block"]');
        const container = document.querySelector('.requests-container');
        const noResultsMessage = container.querySelector('.no-results');
        
        if (visibleCards.length === 0 && searchTerm !== '') {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No requests found matching "${searchTerm}"</p>
                `;
                container.appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    });
}

// Start polling for updates
let pollInterval;

function startPolling() {
    // Poll every 5 seconds
    pollInterval = setInterval(loadRequests, 5000);
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
}

// Start polling when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRequests();
    startPolling();
});

// Stop polling when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopPolling();
    } else {
        startPolling();
    }
}); 