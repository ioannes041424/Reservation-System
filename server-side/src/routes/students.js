const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const bcrypt = require("bcrypt");

router.get('/students', async (req, res) => {
    try {
        const students = await Student.find({}, { hash_password: 0 });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

module.exports = router;
