const express = require("express");
const router = express.Router();

const signupController = require("./signup/signupController");
const loginController = require("./login/loginController");
const googleLoginController = require("./login/googleLoginController");
const userStatusController = require("./status/userStatusController");

// 🔑 Signup Route
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google-login", googleLoginController);
router.get("/status/:id", userStatusController);

module.exports = router;
