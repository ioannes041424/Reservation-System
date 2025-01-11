const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations, checkAvailability, updateStatus } = require('../controller/reservationController');

// Create a new reservation
router.post('/', createReservation);

// Get all reservations
router.get('/', getAllReservations);

// Check room availability
router.get('/check-availability', checkAvailability);

// Update reservation status
router.patch('/:id/status', updateStatus);

module.exports = router; 