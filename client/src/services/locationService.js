import api from "../api/api";

export const getCountries = () => {
    return api.get("/location/countries");
};

export const getStates = (country) => {
    return api.get(
        `/location/states/${encodeURIComponent(country)}`
    );
};

export const getCities = (country, state) => {
    return api.get(
        `/location/cities/${encodeURIComponent(country)}/${encodeURIComponent(state)}`
    );
};