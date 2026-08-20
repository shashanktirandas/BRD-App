
const ConnectDB=require("./src/database/db");
const logger=require("./src/utils/logger")
const LOG_EVENTS = require("./src/constants/logEvents");
const config=require("./src/config/config")

const app=require("./src/app")

ConnectDB();

const PORT = config.server.port;

app.listen(PORT, "0.0.0.0", () => {
    logger.info({
        event: LOG_EVENTS.SERVER_STARTED,
        port: PORT
    });
});