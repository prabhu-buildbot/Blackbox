"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    log: function() {
        return log;
    },
    setupLogging: function() {
        return setupLogging;
    }
});
var _winston = _interop_require_default(require("winston"));
var _winstondailyrotatefile = _interop_require_default(require("winston-daily-rotate-file"));
var _fs = require("fs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var logger = null;
function setupLogging(logDirectory) {
    try {
        if ((0, _fs.existsSync)(logDirectory) === false) (0, _fs.mkdirSync)(logDirectory);
    } catch (error) {
        console.log("\nError creating log folder at: ", logDirectory);
        console.log("Error: ", error);
        return false;
    }
    try {
        var loggingFormat = _winston.default.format.printf(function(param) {
            var timestamp = param.timestamp, message = param.message;
            return "".concat(timestamp, " >> ").concat(message);
        });
        logger = _winston.default.createLogger({
            format: _winston.default.format.combine(_winston.default.format.timestamp({
                format: "HH:mm:ss"
            }), loggingFormat),
            transports: [
                new _winstondailyrotatefile.default({
                    level: "info",
                    datePattern: "DD-MM-YYYY",
                    dirname: logDirectory,
                    filename: "%DATE%_bbLog",
                    extension: ".txt",
                    json: false
                }),
                new _winstondailyrotatefile.default({
                    level: "error",
                    datePattern: "DD-MM-YYYY",
                    dirname: logDirectory,
                    filename: "%DATE%_bbLog",
                    extension: ".txt",
                    handleExceptions: true,
                    json: false
                })
            ]
        });
    } catch (error) {
        console.log("\nError creating logger: ", error);
        return false;
    }
    try {
        logger.add(new _winston.default.transports.Console({
            format: _winston.default.format.combine(_winston.default.format.splat(), _winston.default.format.colorize())
        }));
    } catch (error) {
        console.log("\nError adding console transport to logger: ", error);
        return false;
    }
    return true;
}
var log = function(message) {
    return logger !== null ? logger.info(message) : console.log(message);
};

//# sourceMappingURL=logger.js.map