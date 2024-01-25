
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { existsSync, mkdirSync } from "fs";
// import { join } from "path";

let logger = null;

function setupLogging(logDirectory)
{

    try {

      if (existsSync(logDirectory) === false)
          mkdirSync(logDirectory);

    }
    catch (error) {
      console.log('\nError creating log folder at: ', logDirectory);
      console.log('Error: ', error);
      return(false);
    }

    try {

      const loggingFormat = winston.format.printf(({ timestamp, message }) => `${timestamp} >> ${message}`);

      // Log Level - error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
      logger = winston.createLogger({

        format: winston.format.combine(winston.format.timestamp({format: "HH:mm:ss", }), loggingFormat),
        transports: [ new DailyRotateFile({level: "info",  datePattern: "DD-MM-YYYY",  dirname: logDirectory, filename: `%DATE%_bbLog`, extension: '.txt', json: false, }),
                      new DailyRotateFile({level: "error", datePattern: "DD-MM-YYYY",  dirname: logDirectory, filename: `%DATE%_bbLog`, extension: '.txt', handleExceptions: true, json: false }),
                    ],

      });

    }
    catch (error) {
      console.log('\nError creating logger: ', error);
      return(false);
    }


    try {

      //if (process.env.NODE_ENVIRONMENT === "development")
          logger.add(new winston.transports.Console({ format: winston.format.combine(winston.format.splat(), winston.format.colorize()), }));

    }
    catch (error) {
      console.log('\nError adding console transport to logger: ', error);
      return(false);
    }

   return(true);

}

// const stream = {
//   write: (message: string) => {
//     //logger.info(message.substring(0, message.lastIndexOf("\n")));
//     logger.info(message);
//   },
// };


const log = (message) => (logger !== null) ? logger.info(message):console.log(message); // log method called by everyone


export { log, setupLogging };
