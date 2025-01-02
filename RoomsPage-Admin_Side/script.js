document.addEventListener('DOMContentLoaded', () => {
    const reservationsGrid = document.querySelector('.reservations-grid');
    
    // Function to format date
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Sample reservation data matching the homepage form structure
    const sampleReservations = [
        {
            id: '1',
            room: 'Conference Room A',
            mainParticipant: {
                name: 'John Smith',
                idNumber: '20230001',
                course: 'Computer Science',
                yearSection: '4A',
                contact: '09123456789',
                email: 'john.smith@email.com'
            },
            participantCount: 5,
            date: '2024-01-02',
            timeStart: '9:00 AM',
            timeEnd: '11:00 AM',
            purpose: 'Group Project Meeting',
            status: 'Pending'
        },
        {
            id: '2',
            room: 'Conference Room B',
            mainParticipant: {
                name: 'Maria Garcia',
                idNumber: '20230002',
                course: 'Business Administration',
                yearSection: '3B',
                contact: '09187654321',
                email: 'maria.garcia@email.com'
            },
            participantCount: 8,
            date: '2024-01-02',
            timeStart: '1:00 PM',
            timeEnd: '3:00 PM',
            purpose: 'Thesis Defense Preparation',
            status: 'Approved'
        },
        {
            id: '3',
            room: 'Conference Room A',
            mainParticipant: {
                name: 'David Chen',
                idNumber: '20230003',
                course: 'Engineering',
                yearSection: '4C',
                contact: '09198765432',
                email: 'david.chen@email.com'
            },
            participantCount: 6,
            date: '2024-01-03',
            timeStart: '10:00 AM',
            timeEnd: '12:00 PM',
            purpose: 'Research Presentation',
            status: 'Pending'
        }
    ];

    const cardsHTML = sampleReservations.map(reservation => `
        <div class="reservation-card">
            <div class="reservation-header">
                <div class="room-icon">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="reservation-title">
                    <h3>${reservation.room}</h3>
                    <p>Reserved by: ${reservation.mainParticipant.name}</p>
                </div>
            </div>
            <div class="reservation-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Date: ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Time: ${reservation.timeStart} - ${reservation.timeEnd}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>Participants: ${reservation.participantCount}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-info-circle"></i>
                    <span class="status-${reservation.status.toLowerCase()}">${reservation.status}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${reservation.mainParticipant.course} - ${reservation.mainParticipant.yearSection}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${reservation.mainParticipant.email}</span>
                </div>
            </div>
            <div class="purpose-section">
                <div class="detail-item">
                    <i class="fas fa-clipboard-list"></i>
                    <span><strong>Purpose:</strong> ${reservation.purpose}</span>
                </div>
            </div>
            <div class="reservation-actions">
                <button class="action-btn view-btn" title="View Details" onclick="viewReservation('${reservation.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${reservation.status === 'Pending' ? `
                    <button class="action-btn approve-btn" title="Approve Reservation" onclick="approveReservation('${reservation.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn reject-btn" title="Reject Reservation" onclick="rejectReservation('${reservation.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    reservationsGrid.innerHTML = cardsHTML;
});

// Search functionality
document.getElementById('search-input')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.reservation-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Reservation actions
function viewReservation(id) {
    const reservation = document.querySelector(`[onclick="viewReservation('${id}')"]`)
        .closest('.reservation-card');
    alert('Viewing full details for reservation: ' + id);
}

function approveReservation(id) {
    console.log('Approving reservation:', id);
    alert('Reservation ' + id + ' has been approved');
    // Commented out fetch call
    /*
    fetch(`http://localhost:3001/api/reservations/${id}/approve`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Reservation approved:', data);
        location.reload();
    })
    .catch(error => console.error('Error approving reservation:', error));
    */
    location.reload();
}

function rejectReservation(id) {
    console.log('Rejecting reservation:', id);
    alert('Reservation ' + id + ' has been rejected');
    // Commented out fetch call
    /*
    fetch(`http://localhost:3001/api/reservations/${id}/reject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Reservation rejected:', data);
        location.reload();
    })
    .catch(error => console.error('Error rejecting reservation:', error));
    */
    location.reload();
} 