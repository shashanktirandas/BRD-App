const {
    getCountries,
    getStates,
    getCities
} = require("../services/location_service");


const countries = async (req, res) => {

    const data = await getCountries();

    return res.status(200).json({
        success: true,
        data
    });
};


const states = async (req, res) => {

    const { country } = req.params;

    const data = await getStates(country);

    return res.status(200).json({
        success: true,
        data
    });
};


const cities = async (req, res) => {

    const {
        country,
        state
    } = req.params;

    const data = await getCities(
        country,
        state
    );

    return res.status(200).json({
        success: true,
        data
    });
};


module.exports = {
    countries,
    states,
    cities
};