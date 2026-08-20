
const express = require("express");
const auth_route=require("./routes/auth-route")
const home_route=require("./routes/home-route")
const admin_route=require("./routes/admin-route")
const creator_route=require("./routes/creator-route")
const search_route=require("./routes/search-route")
const analytics_route=require("./routes/analytics-route")
const user_route=require("./routes/user-route")
const otp_route=require("./routes/otp-route")
const errorHandler=require("./middleware/error_middleware")
const cors =require("cors"); 
const searchEngineTestRoute = require("./routes/search-engine-test-route");
const auth_middleware = require("./middleware/auth_middleware");
const locationRoute = require("./routes/location_route");

const app=express();



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use("/auth",auth_route);
app.use("/home",home_route);
app.use("/admin",admin_route);
app.use("/creator",creator_route);
app.use("/search",search_route);
app.use("/analytics",analytics_route);
app.use("/user",user_route);
app.use("/otp",otp_route);

app.use(
    "/location",
    locationRoute
);

app.use("/api/search-engine-test", searchEngineTestRoute);
app.use(
    "/search/engine",
    auth_middleware,
    searchEngineTestRoute
);

app.use(errorHandler);

module.exports=app;