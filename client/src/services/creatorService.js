
import api from "../api/api";

export const creator_info = () => {
    return api.get("/creator/get");
};

export const creator_update = (data) => {
    return api.put("/creator/update",data);
};

export const post_upload = (data) => {
    return api.post("/creator/upload",data);
};
export const creator_getposts = (data) => {
    return api.get("/creator/getposts",data);
};

export const creator_getsinglepost = (id) => {
    return api.get(`/creator/get-single-post/${id}`);
};

export const creator_delete_post = (id) => {
    return api.delete(`/creator/delete-post/${id}`);
};

export const creator_update_post = (id,data) => {
    return api.put(`/creator/update-post/${id}`,data);
};

