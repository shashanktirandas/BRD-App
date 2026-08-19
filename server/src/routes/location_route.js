const express = require("express");

const {
    countries,
    states,
    cities
} = require("../controllers/location_controller");

const route = express.Router();


route.get(
    "/countries",
    countries
);


route.get(
    "/states/:country",
    states
);


route.get(
    "/cities/:country/:state",
    cities
);


module.exports = route;