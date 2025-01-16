const express = require("express");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { signUp, signIn, googleSignIn } = require("../controller/auth");
const {  
  isRequestValidated,
  validateSignUpRequest,
  validateSignInRequest, 
} = require("../middleware/auth");  

// Sign-up route
router.route("/signup").post(validateSignUpRequest, isRequestValidated, signUp);

// Sign-in route
router.route("/signin").post(validateSignInRequest, isRequestValidated, signIn);

// Google sign in
router.post("/google-signin", googleSignIn);

module.exports = router;
