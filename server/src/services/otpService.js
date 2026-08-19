
const bcrypt=require("bcryptjs");
const mail=require("../services/mailService")
const config=require("../config/config")
const otpGenerator=require("otp-generator");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
}=require("../errors/AppError");
const logger=require("../utils/logger");
const LOG_EVENTS = require("../constants/logEvents");
const jwt=require("jsonwebtoken")
const { default: Otp } = require("../model/Otp");
const SendOtpService = async (email, purpose) => {
    try {

        // Remove any previous OTP for this email & purpose
        await Otp.deleteMany({ email, purpose });

        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        await Otp.create({
            email,
            otp,
            purpose,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await mail.otp(email, otp);

        logger.info({
            event: LOG_EVENTS.OTP_DELIVERED
        });

    } catch (err) {
        throw err;
    }
};

const VerifyOtpService = async (email, otp, purpose) => {
    try {

        const otpRecord = await Otp.findOne({
            email,
            otp,
            purpose
        });

        if (!otpRecord) {
            throw new BadRequestError("Invalid OTP");
        }

        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id });
            throw new BadRequestError("OTP has expired");
        }

        // OTP is valid, remove it so it can't be reused
        await Otp.deleteOne({ _id: otpRecord._id });

        return true;

    } catch (err) {
        throw err;
    }
};

module.exports={
    SendOtpService,
    VerifyOtpService
}