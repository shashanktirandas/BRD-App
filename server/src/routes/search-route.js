const express=require("express")
const auth_middleware=require("../middleware/auth_middleware")
const {
    searchBirdName,
    searchCreators,
    searchAll,
    filterAll,
    searchSuggestions,
    searchEngineSearch
} = require("../controllers/search-controller");
const route=express.Router();

route.get("/posts",auth_middleware,searchBirdName);
route.get("/creator",auth_middleware,searchCreators);
route.get("/all",auth_middleware,searchAll);
route.get("/filter",auth_middleware,filterAll);
route.get(
    "/suggestions",
    auth_middleware,
    searchSuggestions
);
route.get(
    "/engine",
    auth_middleware,
    searchEngineSearch
);
module.exports=route;

//shashank c
//siva
//storyblocks c
//innovent c
//memoryvault
//netha