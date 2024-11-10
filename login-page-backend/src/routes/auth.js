const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controller/auth");
const {  
  isRequestValidated,
  validateSignUpRequest,
  validateSignInRequest, 
} = require("../middleware/auth");  // Correctly importing from middleware

// Sign-up route
router.route("/signup").post(validateSignUpRequest, isRequestValidated, signUp);

// Sign-in route
router.route("/signin").post(validateSignInRequest, isRequestValidated, signIn);

module.exports = router;
