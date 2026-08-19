const express = require("express");
const router = express.Router();

const { 
        sendOtp,
        verifyOtp
                    } = require("../controllers/otp-controller");
const auth_middleware=require("../middleware/auth_middleware");
const { verify } = require("jsonwebtoken");

router.post("/send-otp", auth_middleware, sendOtp);
router.post("/verify-otp", auth_middleware, verifyOtp);

module.exports = router;