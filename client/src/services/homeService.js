import api from "../api/api";

export const get_post_likes = (id) => {
    return api.get(`/home/post/${id}/likes`);
};

export const get_post_bookmarks = (id) => {
    return api.get(`/home/post/${id}/bookmarks`);
};

export const get_similar_posts = (
    id,
    limit = 10,
    menuType = null,
    menuValue = null
) => {

    return api.get(
        `/home/post/${id}/similar`,
        {
            params: {
                limit,
                menuType,
                menuValue
            }
        }
    );
};

export const get_personalized_menu = () => {
    return api.get(`home/menu`);
};

export const get_posts = (
    page = 1,
    limit = 10,
    excludeIds = [],
    menuType = null,
    menuValue = null
) => {

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (excludeIds.length > 0) {
        params.append(
            "excludeIds",
            excludeIds.join(",")
        );
    }

    if (menuType && menuValue) {
        params.append("menuType", menuType);
        params.append("menuValue", menuValue);
    }

    return api.get(
        `/home/posts?${params.toString()}`
    );
};
//@
export const get_single_post = (id) => {
    return api.get(`/home/${id}/post`); 
};

export const record_post_view = (id, duration) => {

    return api.post(
        `/home/post/${id}/view`,
        {
            duration
        }
    );

};

export const get_single_creator = (id) => {
    return api.get(`home/creator/${id}/info`); 
};

export const get_creator_posts = (id) => {
    return api.get(`home/creator/${id}/posts`); 
};

export const get_creator_followers = (id) => {
    return api.get(`home/creator/${id}/followers`); 
};

export const check_follow = (id) => {
    return api.get(`home/user/${id}/follow`); 
};

export const follow_creator = (id) => {
    return api.get(`home/${id}/creator-follow`); 
};

export const unfollow_creator = (id) => {
    return api.delete(`home/${id}/creator-unfollow`); 
};

export const check_post_follow = (id) => {
    return api.get(`home/user/post/${id}/follow`); 
};

export const follow_post_creator = (id) => {
    return api.get(`home/${id}/creator-post-follow`); 
};

export const unfollow_post_creator = (id) => {
    return api.delete(`home/${id}/creator-post-unfollow`); 
};

export const check_post_like = (id) => {
    return api.get(`home/post/${id}/is-like`); 
};

export const check_post_bookmark = (id) => {
    return api.get(`home/post/${id}/is-bookmark`); 
};

export const like_post = (id) => {
    return api.get(`home/${id}/post-like`); 
};

export const dislike_post = (id) => {
    return api.delete(`home/${id}/post-dislike`); 
}

export const bookmark_post = (id) => {
    return api.get(`home/${id}/post-bookmark`); 
};

export const remove_bookmark_post = (id) => {
    return api.delete(`home/${id}/post-remove-bookmark`); 
}

export const get_bookmark_posts = () => {
    return api.get(`home/bookmark-posts`); 
}

export const get_following_accounts = () => {
    return api.get(`home/user/following-accounts`); 
}