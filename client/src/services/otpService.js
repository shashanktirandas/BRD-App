import api from "../api/api";

export const send_otp = (data) => {
    return api.post("/otp/send-otp",data);
};

export const verify_otp = (data) => {
    return api.post("/otp/verify-otp",data);
};

export const auth_send_otp = (data) => {
    return api.post("/auth/send-otp",data);
};

export const auth_verify_otp = (data) => {
    return api.post("/auth/verify-otp",data);
};