const axios = require("axios");

const LOCATION_API =
    "https://countriesnow.space/api/v0.1";

const getCountries = async () => {

    const response = await axios.get(
        `${LOCATION_API}/countries`
    );

    return response.data.data;
};


const getStates = async (country) => {

    const response = await axios.post(
        `${LOCATION_API}/countries/states`,
        {
            country
        }
    );

    return response.data.data.states;
};


const getCities = async (country, state) => {

    const response = await axios.post(
        `${LOCATION_API}/countries/state/cities`,
        {
            country,
            state
        }
    );

    return response.data.data;
};


module.exports = {
    getCountries,
    getStates,
    getCities
};