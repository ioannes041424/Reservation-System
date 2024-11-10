const { check, validationResult } = require("express-validator");

// Validation rules for sign-up
const validateSignUpRequest = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email required"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Validation rules for sign-in (fixed typo here)
const validateSignInRequest = [
  check("email").isEmail().withMessage("Valid Email required"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Middleware function to check validation results
const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  validateSignUpRequest,
  validateSignInRequest, // Corrected the function name here
  isRequestValidated,
};
