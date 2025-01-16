const Reservation = require('../models/reservation');
const { StatusCodes } = require('http-status-codes');

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Reservation created successfully',
            data: reservation
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Failed to create reservation',
            error: error.message
        });
    }
};

// Get all reservations with optional filters
exports.getAllReservations = async (req, res) => {
    try {
        const { status, date } = req.query;
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.reservationDate = { $gte: startDate, $lte: endDate };
        }

        const reservations = await Reservation.find(query).sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({
            success: true,
            data: reservations
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch reservations',
            error: error.message
        });
    }
};

// Check room availability
exports.checkAvailability = async (req, res) => {
    try {
        const { room, reservationDate, timeStart, timeEnd } = req.query;
        
        // Convert date string to Date object
        const date = new Date(reservationDate);
        
        // Find any overlapping reservations
        const overlappingReservations = await Reservation.find({
            room,
            reservationDate: date,
            $or: [
                {
                    timeStart: { $lt: timeEnd },
                    timeEnd: { $gt: timeStart }
                }
            ],
            status: 'approved'
        });

        const isAvailable = overlappingReservations.length === 0;

        res.status(StatusCodes.OK).json({
            success: true,
            isAvailable,
            conflictingReservations: isAvailable ? [] : overlappingReservations
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to check availability',
            error: error.message
        });
    }
};

// Update reservation status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const reservation = await Reservation.findById(id);
        
        if (!reservation) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        if (status === 'approved') {
            // Check if the room is still available
            const overlappingReservations = await Reservation.find({
                _id: { $ne: id },
                room: reservation.room,
                reservationDate: reservation.reservationDate,
                status: 'approved',
                $or: [
                    {
                        timeStart: { $lt: reservation.timeEnd },
                        timeEnd: { $gt: reservation.timeStart }
                    }
                ]
            });

            if (overlappingReservations.length > 0) {
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    message: 'Room is no longer available for this time slot'
                });
            }
        }

        reservation.status = status;
        await reservation.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Reservation ${status} successfully`,
            data: reservation
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update reservation status',
            error: error.message
        });
    }
};
