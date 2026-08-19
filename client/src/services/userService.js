import api from "../api/api";

export const profile_info = () => {
    return api.get("/user/get");
};

export const profile_update = (data) => {
    return api.put("/user/update",data);
};

export const profile_transform = (data) => {
    return api.post("/creator/register",data);
};

