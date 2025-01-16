const express = require("express");
const router = express.Router();
const { createReservation } = require("../controller/reservationController");
const validateReservation = require("../middleware/validateReservation"); 


router.post("/reservation", validateReservation, createReservation);

module.exports = router;
