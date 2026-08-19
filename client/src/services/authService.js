import api from "../api/api";

export const partialSignup = (data) => {
    return api.post("/auth/partialsignup", data);
};

export const signup = (data) => {
    return api.post("/auth/signup", data);
};

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const partialSignupV2 = (data) => {
    return api.post("/auth/partialsignupv2", data);
};

export const signupV2 = (data) => {
    return api.post("/auth/signupv2", data);
};