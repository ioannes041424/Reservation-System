const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id_number: {
        type: String,
        required: true,
        trim: true
    }
});

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id_number: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    yearSection: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    participantCount: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 20
    },
    participants: [participantSchema],
    room: {
        type: String,
        required: true,
        trim: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    timeStart: {
        type: String,
        required: true
    },
    timeEnd: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reservation", reservationSchema);
