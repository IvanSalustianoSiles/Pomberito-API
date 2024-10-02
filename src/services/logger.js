import winston from "winston";
import config from "../config.js"


const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3, // Production
        http: 4,
        debug: 5 // Development
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue", 
        http: "green",
        debug: "white" 
    }
}
const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ 
            level: "info",
        }),
        new winston.transports.File({ 
            level: "error", 
            filename: `${config.DIRNAME}/logs/prod.log`,
        })
    ]
});

const develLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ 
            level: "debug",
        }),
        new winston.transports.File({ 
            level: "info",
            filename: `${config.DIRNAME}/logs/devel.log`
        })
    ]
});

const addLogger = async (req, res, next) => {
    req.logger = config.MODE == "prod" ? prodLogger : develLogger;
    next();
};

export default addLogger;