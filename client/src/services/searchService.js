import api from "../api/api";


// ==========================================
// SEARCH SUGGESTIONS
// ==========================================

export const get_search_suggestions = (query) => {

    return api.get(
        "/search/suggestions",
        {
            params: {
                q: query
            }
        }
    );

};


// ==========================================
// FULL SEARCH
// ==========================================

export const search_all = (
    query,
    page = 1,
    limit = 20,
    type = "all"
) => {

    return api.get(
        "/search/engine",
        {
            params: {
                q: query,
                page,
                limit,
                type
            }
        }
    );

};