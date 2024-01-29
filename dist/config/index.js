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
    AIRPORT_CODE: function() {
        return AIRPORT_CODE;
    },
    BOWMONK_BAUDRATE: function() {
        return BOWMONK_BAUDRATE;
    },
    BOWMONK_COMMAND_PAUSE: function() {
        return BOWMONK_COMMAND_PAUSE;
    },
    BOWMONK_PORT: function() {
        return BOWMONK_PORT;
    },
    BOWMONK_TIMEOUT: function() {
        return BOWMONK_TIMEOUT;
    },
    GPS_BAUDRATE: function() {
        return GPS_BAUDRATE;
    },
    GPS_LATITUDE_OFFSET: function() {
        return GPS_LATITUDE_OFFSET;
    },
    GPS_LONGITUDE_OFFSET: function() {
        return GPS_LONGITUDE_OFFSET;
    },
    GPS_PORT: function() {
        return GPS_PORT;
    },
    GPS_PROCESS_SPEED: function() {
        return GPS_PROCESS_SPEED;
    },
    INVALID_FRICTION: function() {
        return INVALID_FRICTION;
    },
    INVALID_TEMPERATURE: function() {
        return INVALID_TEMPERATURE;
    },
    LOCATION_UPDATE_RATE: function() {
        return LOCATION_UPDATE_RATE;
    },
    LOG_DIRECTORY: function() {
        return LOG_DIRECTORY;
    },
    LOG_FORMAT: function() {
        return LOG_FORMAT;
    },
    NODE_ENVIRONMENT: function() {
        return NODE_ENVIRONMENT;
    },
    RSC_READING_MAX_AGE: function() {
        return RSC_READING_MAX_AGE;
    },
    SERVER_PORT: function() {
        return SERVER_PORT;
    },
    SERVER_UPDATE_RATE: function() {
        return SERVER_UPDATE_RATE;
    },
    USING_METRIC: function() {
        return USING_METRIC;
    },
    VAISALA_BAUDRATE: function() {
        return VAISALA_BAUDRATE;
    },
    VAISALA_PORT: function() {
        return VAISALA_PORT;
    },
    setupConfiguration: function() {
        return setupConfiguration;
    }
});
var _fs = require("fs");
var _dotenv = require("dotenv");
var _logger = require("../utils/logger");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var option_file = "blackbox.options";
var LOCATION_UPDATE_RATE = 1000;
var GPS_PROCESS_SPEED = .01;
var SERVER_UPDATE_RATE = 1000;
var USING_METRIC = true;
var SERVER_PORT = "8081";
var LOG_FORMAT = "dev";
var LOG_DIRECTORY = "./logs";
var GPS_PORT = "/dev/ttyUSB2";
var GPS_BAUDRATE = 115200;
var GPS_LATITUDE_OFFSET = 0;
var GPS_LONGITUDE_OFFSET = 0;
var VAISALA_PORT = "/dev/ttyUSB1";
var VAISALA_BAUDRATE = 9600;
var BOWMONK_PORT = "/dev/ttyUSB0";
var BOWMONK_BAUDRATE = 9600;
var BOWMONK_COMMAND_PAUSE = 5;
var BOWMONK_TIMEOUT = 500;
var RSC_READING_MAX_AGE = 30;
var INVALID_TEMPERATURE = -66;
var INVALID_FRICTION = -1;
var AIRPORT_CODE = "XXX";
var NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT;
(0, _dotenv.config)();
function log(message) {
    (0, _logger.log)(message);
}
function fileError(error) {
    if (error) console.log("Error adding default option");
}
function setupConfiguration() {
    return _setupConfiguration.apply(this, arguments);
}
function _setupConfiguration() {
    _setupConfiguration = _async_to_generator(function() {
        var data, dataLines, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        26,
                        ,
                        27
                    ]);
                    if (!((0, _fs.existsSync)(option_file) === false)) return [
                        3,
                        25
                    ];
                    log("default options file needs to be created");
                    return [
                        4,
                        (0, _fs.writeFile)(option_file, "// Blackbox Options\n\n", function(error) {
                            if (error) log("Error creating option file: " + error);
                            else log("Options File Created");
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "\n// General Options" + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "AirportCode=" + AIRPORT_CODE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "ServerUpdateRate=" + SERVER_UPDATE_RATE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "UsingMetric=" + USING_METRIC + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 5:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "LocationUpdateRate=" + LOCATION_UPDATE_RATE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 6:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "GpsProcessSpeed=" + GPS_PROCESS_SPEED + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 7:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "ServerPort=" + SERVER_PORT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "LogFormat=" + LOG_FORMAT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 9:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "LogDirectory=" + LOG_DIRECTORY + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 10:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "rscReadingMaxAge=" + RSC_READING_MAX_AGE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 11:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "\n// GPS Options" + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 12:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "GpsPort=" + GPS_PORT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 13:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "GpsBaudrate=" + GPS_BAUDRATE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 14:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "LatitudeOffset=" + GPS_LATITUDE_OFFSET + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 15:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "LongitudeOffset=" + GPS_LONGITUDE_OFFSET + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 16:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "\n// Bowmonk Options" + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 17:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "BowmonkPort=" + BOWMONK_PORT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 18:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "BowmonkBaudrate=" + BOWMONK_BAUDRATE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 19:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "BowmonkCommandPause=" + BOWMONK_COMMAND_PAUSE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 20:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "BowmonkTimeout=" + BOWMONK_TIMEOUT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 21:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "\n// Vaisala Options" + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 22:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "VaisalaPort=" + BOWMONK_PORT + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 23:
                    _state.sent();
                    return [
                        4,
                        (0, _fs.appendFile)(option_file, "VaisalaBaudrate=" + VAISALA_BAUDRATE + "\n", function(error) {
                            return fileError(error);
                        })
                    ];
                case 24:
                    _state.sent();
                    log("- '" + option_file + "' default options added");
                    _state.label = 25;
                case 25:
                    try {
                        data = (0, _fs.readFileSync)(option_file);
                        dataLines = data.toString("utf8").split("\n");
                        dataLines.forEach(function(line) {
                            if (line.includes("AirportCode")) AIRPORT_CODE = line.split("=")[1];
                            if (line.includes("ServerUpdateRate")) SERVER_UPDATE_RATE = parseInt(line.split("=")[1]);
                            if (line.includes("UsingMetric")) USING_METRIC = parseInt(line.split("=")[1]) > 0;
                            if (line.includes("LocationUpdateRate")) LOCATION_UPDATE_RATE = parseInt(line.split("=")[1]);
                            if (line.includes("GpsProcessSpeed")) GPS_PROCESS_SPEED = parseInt(line.split("=")[1]);
                            if (line.includes("ServerPort")) SERVER_PORT = line.split("=")[1];
                            if (line.includes("LogFormat")) LOG_FORMAT = line.split("=")[1];
                            if (line.includes("LogDirectory")) LOG_DIRECTORY = line.split("=")[1];
                            if (line.includes("rscReadingMaxAge")) RSC_READING_MAX_AGE = parseInt(line.split("=")[1]);
                            if (line.includes("GpsPort")) GPS_PORT = line.split("=")[1];
                            if (line.includes("GpsBaudrate")) GPS_BAUDRATE = parseInt(line.split("=")[1]);
                            if (line.includes("LatitudeOffset")) GPS_LATITUDE_OFFSET = parseInt(line.split("=")[1]);
                            if (line.includes("LongitudeOffset")) GPS_LONGITUDE_OFFSET = parseInt(line.split("=")[1]);
                            if (line.includes("BowmonkPort")) BOWMONK_PORT = line.split("=")[1];
                            if (line.includes("BowmonkBaudrate")) BOWMONK_BAUDRATE = parseInt(line.split("=")[1]);
                            if (line.includes("BowmonkCommandPause")) BOWMONK_COMMAND_PAUSE = parseInt(line.split("=")[1]);
                            if (line.includes("BowmonkTimeout")) BOWMONK_TIMEOUT = parseInt(line.split("=")[1]);
                            if (line.includes("VaisalaPort")) VAISALA_PORT = line.split("=")[1];
                            if (line.includes("VaisalaBaudrate")) VAISALA_BAUDRATE = parseInt(line.split("=")[1]);
                        });
                    } catch (error) {
                        console.log("Error adding default option");
                    }
                    log("");
                    log("General Options");
                    log("  Airport Code: " + AIRPORT_CODE);
                    log("  Server Update Rate: " + SERVER_UPDATE_RATE);
                    log("  Using Metric: " + USING_METRIC);
                    log("  Location Update Rate: " + LOCATION_UPDATE_RATE);
                    log("  GPS Process Speed: " + GPS_PROCESS_SPEED);
                    log("  Server Port: " + SERVER_PORT);
                    log("  Log Format: " + LOG_FORMAT);
                    log("  Log Directory: " + LOG_DIRECTORY);
                    log("  RSC Reading Max Age: " + RSC_READING_MAX_AGE + " minutes");
                    log("");
                    log("GPS Options");
                    log("  Port: " + GPS_PORT);
                    log("  Baud: " + GPS_BAUDRATE);
                    log("  Lat Offset: " + GPS_LATITUDE_OFFSET);
                    log("  Long Offset: " + GPS_LONGITUDE_OFFSET);
                    log("");
                    log("Bowmonk Options");
                    log("  Port: " + BOWMONK_PORT);
                    log("  Baud: " + BOWMONK_BAUDRATE);
                    log("  Command Pause (msec): " + BOWMONK_COMMAND_PAUSE);
                    log("  Timeout (msec): " + BOWMONK_TIMEOUT);
                    log("");
                    log("Vaisala Options");
                    log("  Port: " + VAISALA_PORT);
                    log("  Baud: " + VAISALA_BAUDRATE);
                    return [
                        3,
                        27
                    ];
                case 26:
                    error = _state.sent();
                    log("\nError creating default options file: blackbox_options");
                    log("Error: " + error);
                    return [
                        3,
                        27
                    ];
                case 27:
                    return [
                        2
                    ];
            }
        });
    });
    return _setupConfiguration.apply(this, arguments);
}

//# sourceMappingURL=index.js.map