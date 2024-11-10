const { StatusCodes } = require("http-status-codes");
const Student = require("../models/student");  // Update path to match your model file
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide required information",
    });
  }

  try {
    const hash_password = await bcrypt.hash(password, 10);

    const studentData = {
      name,
      email,
      hash_password,
    };

    // Check if user already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already registered",
      });
    }

    // Create new student
    const newStudent = await Student.create(studentData);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user: { _id: newStudent._id, name: newStudent.name, email: newStudent.email },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during registration",
      error: err.message,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please enter email and password",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, student.hash_password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return the token and user data
    const { _id, name, email: studentEmail } = student; // Rename 'email' to 'studentEmail' here
    res.status(StatusCodes.OK).json({
      token,
      user: { _id, name, email: studentEmail }, // Use 'studentEmail' here
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during sign-in",
      error: error.message,
    });
  }
};

module.exports = { signUp, signIn };
