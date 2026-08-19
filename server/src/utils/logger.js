const log = (level, logData) => {

    const finalLog = {
        timestamp: new Date().toISOString(),
        level,
        ...logData
    };

    console.log(finalLog);

};

const logger = {

    info(logData){
        log("INFO", logData);
    },

    warn(logData){
        log("WARN", logData);
    },

    error(logData){
        log("ERROR", logData);
    },

    debug(logData){
        log("DEBUG", logData);
    }

};

module.exports = logger;