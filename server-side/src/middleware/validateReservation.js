function validateReservation(req, res, next) {
    const { 
        name, 
        id_number, 
        course, 
        yearSection, 
        contact, 
        email, 
        participants,
        room, 
        reservationDate, 
        timeStart, 
        timeEnd, 
        purpose   
    } = req.body;

    // Validation errors array
    const errors = [];

    // Required fields validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a valid string.');
    }
    if (!id_number || typeof id_number !== 'string' || id_number.trim() === '') {
        errors.push('ID number is required and must be a valid string.');
    }
    if (!course || typeof course !== 'string' || course.trim() === '') {
        errors.push('Course is required and must be a valid string.');
    }
    if (!yearSection || typeof yearSection !== 'string' || yearSection.trim() === '') {
        errors.push('Year and Section are required and must be valid.');
    }
    if (!contact || !/^\d{11}$/.test(contact)) {
        errors.push('Contact must be a valid 11-digit number.');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Email must be a valid email address.');
    }
    if (!room || typeof room !== 'string' || room.trim() === '') {
        errors.push('Room is required and must be a valid string.');
    }
    if (!reservationDate || isNaN(Date.parse(reservationDate))) {
        errors.push('Reservation date is required and must be a valid date.');
    }
    if (!timeStart || !/^\d{2}:\d{2}$/.test(timeStart)) {
        errors.push('Time start is required and must be in HH:MM format.');
    }
    if (!timeEnd || !/^\d{2}:\d{2}$/.test(timeEnd)) {
        errors.push('Time end is required and must be in HH:MM format.');
    }
    if (!purpose || typeof purpose !== 'string' || purpose.trim() === '') {
        errors.push('Purpose is required and must be a valid string.');
    }
    if (!Array.isArray(participants)) {
        errors.push('Participants must be an array.');
    }

    // Check participants
    participants.forEach((participant, index) => {
        if (!participant.name || typeof participant.name !== 'string' || participant.name.trim() === '') {
            errors.push(`Participant ${index + 1} name is invalid.`);
        }
        if (!participant.id_number || typeof participant.id_number !== 'string' || participant.id_number.trim() === '') {
            errors.push(`Participant ${index + 1} ID number is invalid.`);
        }
        if (!participant.course || typeof participant.course !== 'string' || participant.course.trim() === '') {
            errors.push(`Participant ${index + 1} course is invalid.`);
        }
        if (!participant.yearSection || typeof participant.yearSection !== 'string' || participant.yearSection.trim() === '') {
            errors.push(`Participant ${index + 1} year and section are invalid.`);
        }
    });

    // If errors exist, return them
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // If no errors, proceed to the next middleware or route
    next();
}

module.exports = validateReservation;
