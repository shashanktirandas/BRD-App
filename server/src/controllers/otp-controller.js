const { SendOtpService, VerifyOtpService } = require("../services/otpService");
const successResponse = require("./successResponse");
const logger = require("../utils/logger");

const sendOtp = async (req, res, next) => {
    try {

        const { email } = req.accessToken;
        const { purpose } = req.body;

        await SendOtpService(email, purpose);

        logger.info( {
            message: `OTP sent successfully for ${purpose}`
        });

        return successResponse(res, {
            message: "OTP sent successfully."
        });

    } catch (err) {
        next(err);
    }
};

const verifyOtp = async (req, res, next) => {
    try {

        const { email } = req.accessToken;
        const { otp, purpose } = req.body;

        await VerifyOtpService(email, otp, purpose);

        logger.info( {
            message: `OTP verified successfully for ${purpose}`
        });

        return successResponse(res, {
            message: "OTP verified successfully."
        });

    } catch (err) {
        next(err);
    }
};

const authSendOtp = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        await SendOtpService(email, purpose);

        logger.info( {
            message: `OTP sent successfully for ${purpose}`
        });

        return successResponse(res, {
            message: "OTP sent successfully."
        });

    } catch (err) {
        next(err);
    }
};

const authVerifyOtp = async (req, res, next) => {
    try {

        const { email, otp, purpose } = req.body;

        await VerifyOtpService(email, otp, purpose);

        logger.info( {
            message: `OTP verified successfully for ${purpose}`
        });

        return successResponse(res, {
            message: "OTP verified successfully."
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    authSendOtp,
    authVerifyOtp
};