const express=require("express");
const {
    UserRegisterSchema
}=require("../validators/user.validator")
const validate=require("../middleware/validate_middleware")
const {partial_signup,login,signup,partial_signupv2,signupv2}=require("../controllers/auth-controller");
const { authSendOtp, authVerifyOtp } = require("../controllers/otp-controller");
const route=express.Router();
route.post("/partialsignup",validate(UserRegisterSchema),partial_signup);
route.post("/login",login);
route.post("/signup",signup);
route.post("/partialsignupv2",validate(UserRegisterSchema),partial_signupv2);
route.post("/signupv2",signupv2);
route.post("/send-otp", authSendOtp);
route.post("/verify-otp",authVerifyOtp);

module.exports=route;