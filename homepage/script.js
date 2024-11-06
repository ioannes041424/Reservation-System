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

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

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
        for (let i = 1; i < count; i++) {
            const participantSection = document.createElement('div');
            participantSection.className = 'participant-section';
            
            const participantTitle = document.createElement('div');
            participantTitle.className = 'participant-title';
            participantTitle.textContent = `Participant ${i + 1} Details`;
            participantSection.appendChild(participantTitle);
            
            const participantForm = createParticipantForm(i + 1);
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
                <input type="text" id="name-${index}" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label for="id-${index}">ID Number</label>
                <input type="text" id="id-${index}" required placeholder="Enter ID number">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="course-${index}">Course</label>
                <input type="text" id="course-${index}" required placeholder="Enter course">
            </div>
            <div class="form-group">
                <label for="section-${index}">Year & Section</label>
                <input type="text" id="section-${index}" required placeholder="Enter year and section">
            </div>
        </div>
    `;
    return wrapper;
}