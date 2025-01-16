// Kini nga function mo initialize sa calendar widget para sa pag display sa calendar
flatpickr("#calendar", {
    inline: true,
    dateFormat: "Y-m-d",
    minDate: "today",
    enableTime: false,
    monthSelectorType: 'dropdown',
    showMonths: 1,
    defaultDate: "today",
    onChange: function(selectedDates, dateStr) {
        // Mo format sa petsa nga gi pili sa user
        const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const dateDisplay = document.getElementById('selected-date-text');
        dateDisplay.textContent = formattedDate;
        dateDisplay.style.color = 'var(--primary-color)';
        dateDisplay.style.fontWeight = '500';
    }
});

// Mo initialize sa date picker para sa reservation form
flatpickr("#reservation-date", {
    dateFormat: "F j, Y",
    minDate: "today",
    enableTime: false,
    monthSelectorType: 'dropdown',
    onChange: function(selectedDates, dateStr) {
        document.getElementById('reservation-date').value = dateStr;
    }
});

// Kini nga function mo generate sa mga available nga time slots (7 AM to 4 PM)
function generateTimeSlots() {
    const slots = [];
    for (let hour = 7; hour <= 16; hour++) {
        for (let minute of ['00', '30']) {
            if (hour === 16 && minute === '30') continue;
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour;
            slots.push(`${displayHour}:${minute} ${period}`);
        }
    }
    return slots;
}

// Mo initialize sa time picker para sa start ug end time
['time-start', 'time-end'].forEach(id => {
    const input = document.getElementById(id);
    const timeDropdown = document.createElement('div');
    timeDropdown.className = 'time-dropdown';
    
    generateTimeSlots().forEach(time => {
        const option = document.createElement('div');
        option.className = 'time-option';
        option.textContent = time;
        option.onclick = () => {
            input.value = time;
            timeDropdown.classList.remove('show');
            validateTimeSelection();
        };
        timeDropdown.appendChild(option);
    });
    
    input.parentNode.appendChild(timeDropdown);
    
    input.onclick = () => {
        timeDropdown.classList.add('show');
    };
});

// Mo close sa dropdown kung mo click sa gawas
document.addEventListener('click', (e) => {
    if (!e.target.closest('.time-input')) {
        document.querySelectorAll('.time-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// Mo check kung valid ba ang selected time (dili dapat mo lapas 2 hours)
function validateTimeSelection() {
    const startInput = document.getElementById('time-start');
    const endInput = document.getElementById('time-end');
    const validationMessage = document.getElementById('time-validation-message');
    
    if (startInput.value && endInput.value) {
        const start = convertTimeStringToMinutes(startInput.value);
        const end = convertTimeStringToMinutes(endInput.value);
        
        if (end - start > 120) {
            endInput.value = '';
            validationMessage.textContent = 'Maximum meeting duration is 2 hours';
            validationMessage.classList.add('show');
            return false;
        }
        
        if (end <= start) {
            endInput.value = '';
            validationMessage.textContent = 'End time must be after start time';
            validationMessage.classList.add('show');
            return false;
        }
    }
    
    validationMessage.classList.remove('show');
    return true;
}

// Mo convert sa time string ngadto sa minutes para sayon i-compare
function convertTimeStringToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
}

// Mo update sa available end times base sa selected start time
function updateEndTimeOptions(startTime) {
    const endTimeDropdown = document.querySelector('#time-end + .time-dropdown');
    endTimeDropdown.innerHTML = '';
    
    const startMinutes = convertTimeStringToMinutes(startTime);
    const slots = generateTimeSlots();
    
    slots.forEach(slot => {
        const slotMinutes = convertTimeStringToMinutes(slot);
        if (slotMinutes > startMinutes && slotMinutes <= startMinutes + 120) {
            const option = document.createElement('div');
            option.className = 'time-option';
            option.textContent = slot;
            option.onclick = () => {
                document.getElementById('time-end').value = slot;
                endTimeDropdown.classList.remove('show');
                validateTimeSelection();
            };
            endTimeDropdown.appendChild(option);
        }
    });
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Mo handle sa tanan events sa modal (pag open ug close)
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('registration-modal');
    const reserveBtn = document.getElementById('reserve-btn');
    const closeBtn = document.querySelector('.close');

    if (!modal || !reserveBtn || !closeBtn) {
        console.error('Modal elements not found');
        return;
    }

    reserveBtn.addEventListener('click', function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

// Mo validate sa form inputs
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.match(/^[a-zA-Z\s]{2,50}$/)) {
        errors.push('Please enter a valid name (2-50 characters, letters only)');
    }
    
    if (!formData.id_number.match(/^[0-9]{5,10}$/)) {
        errors.push('Please enter a valid ID number (5-10 digits)');
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('Please enter a valid email address');
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    if (selectedDate < today) {
        errors.push('Please select a future date');
    }
    
    return errors;
}


// Convert time to HH:MM format
function convertToHHMM(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Mo validate ug mo submit sa form data sa backend
document.getElementById('reservation-form').addEventListener('submit', async function (e) {
    e.preventDefault();    

    try {
        const timeStart = convertToHHMM(document.getElementById('time-start').value);
        const timeEnd = convertToHHMM(document.getElementById('time-end').value);

        // Collect additional participants
        const participantCount = parseInt(document.getElementById('participant-count').value);
        const participants = [];

        // Start from 2 since participant 1 is the main user
        for (let i = 2; i <= participantCount; i++) {
            const nameElement = document.getElementById(`name-${i}`);
            const idElement = document.getElementById(`id_number-${i}`);
            
            if (nameElement && idElement) {
                participants.push({
                    name: nameElement.value.trim(),
                    id_number: idElement.value.trim()
                });
            }
        }

        // Mao ni mo collect sa form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            id_number: document.getElementById('id_number').value.trim(), 
            course: document.getElementById('course').value.trim(),
            yearSection: document.getElementById('year_section').value.trim(),
            contact: document.getElementById('contact').value.trim(),
            email: document.getElementById('email').value.trim(),
            participantCount: participantCount,
            participants: participants,
            room: document.getElementById('room').value,
            reservationDate: document.getElementById('reservation-date').value,
            timeStart,
            timeEnd,
            purpose: document.getElementById('purpose').value.trim()
        };

        // Validate the form data
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // First check if the room is available
        const checkAvailabilityResponse = await fetch(`http://localhost:3001/api/reservations/check-availability?${new URLSearchParams({
            room: formData.room,
            reservationDate: formData.reservationDate,
            timeStart: formData.timeStart,
            timeEnd: formData.timeEnd
        })}`);

        if (!checkAvailabilityResponse.ok) {
            throw new Error(`Server returned ${checkAvailabilityResponse.status}: ${checkAvailabilityResponse.statusText}`);
        }

        const availabilityData = await checkAvailabilityResponse.json();

        if (!availabilityData.isAvailable) {
            alert('This room is not available for the selected time slot. Please choose a different time or room.');
            return;
        }

        // If room is available, proceed with reservation
        const response = await fetch('http://localhost:3001/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || 'Failed to submit reservation');
        }

        const data = await response.json();
        alert('Reservation submitted successfully! Please wait for approval.');
        document.getElementById('reservation-form').reset();
        closeModal();
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to submit reservation: ${error.message}`);
    }
});

// Mo update sa current time display kada segundo
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    timeElement.textContent = timeString;
    dateElement.textContent = dateString;
}

setInterval(updateTime, 1000);
updateTime();

// Mo handle sa pag add ug remove sa additional participants
document.getElementById('participant-count').addEventListener('change', function(e) {
    const count = parseInt(e.target.value);
    const container = document.getElementById('participants-container');
    container.innerHTML = '';

    if (count > 1) {
        // Start from 2 since participant 1 is the main user
        for (let i = 2; i <= count; i++) {
            const participantSection = document.createElement('div');
            participantSection.className = 'participant-section';
            
            const participantTitle = document.createElement('div');
            participantTitle.className = 'participant-title';
            participantTitle.textContent = `Participant ${i} Details`;
            participantSection.appendChild(participantTitle);
            
            const participantForm = createParticipantForm(i);
            participantSection.appendChild(participantForm);
            
            container.appendChild(participantSection);
        }
    }
});

// Mo create ug form para sa additional participants
function createParticipantForm(index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'participant-form';
    wrapper.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="name-${index}">Full Name</label>
                <input type="text" id="name-${index}" name="participant-name-${index}" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label for="id_number-${index}">ID Number</label>
                <input type="text" id="id_number-${index}" name="participant-id-${index}" required placeholder="Enter ID number">
            </div>
        </div>
    `;
    return wrapper;
}