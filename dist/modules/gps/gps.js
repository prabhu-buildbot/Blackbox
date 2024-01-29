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
    gpsPortSetup: function() {
        return gpsPortSetup;
    },
    gpsPortState: function() {
        return gpsPortState;
    },
    setGpsPortState: function() {
        return setGpsPortState;
    },
    defaultInvalidGpsData: function() {
        return defaultInvalidGpsData;
    },
    currentGPSData: function() {
        return currentGPSData;
    }
});
var _serialport = require("serialport");
var _parserreadline = require("@serialport/parser-readline");
var _logger = require("../../utils/logger");
var _config = require("../../config");
var GPS_PARSER = require("gps");
var defaultInvalidGpsData = {
    valid: false,
    timedate: "",
    latitude: null,
    longitude: null,
    speed: 0,
    track: 0
};
var serialPort = null;
var currentGPSData = defaultInvalidGpsData;
var gpsPortState = false;
var socketIO = null;
var webAppUpdateRate = 1000;
var gpsProcessSpeed = 2;
function setGpsPortState(state) {
    gpsPortState = state;
}
var showData = function(dataString) {
    log(dataString);
};
function log(message) {
    (0, _logger.log)("gps > " + message);
}
function gpsPortSetup(serverSocketIO) {
    currentGPSData = defaultInvalidGpsData;
    socketIO = serverSocketIO;
    webAppUpdateRate = _config.LOCATION_UPDATE_RATE;
    gpsProcessSpeed = _config.GPS_PROCESS_SPEED;
    log("Web App update rate: " + webAppUpdateRate + " ms");
    log("GPS processing limit speed: " + gpsProcessSpeed + " kmh");
    try {
        log("Opening gps port: " + _config.GPS_PORT + " @ baudrate: " + _config.GPS_BAUDRATE);
        var readlineParser = new _parserreadline.ReadlineParser();
        readlineParser.on("data", gpsDataReceived);
        serialPort = new _serialport.SerialPort({
            path: _config.GPS_PORT,
            baudRate: _config.GPS_BAUDRATE,
            autoOpen: false
        });
        serialPort.pipe(readlineParser);
        serialPort.on("error", function(error) {
            log("Error on gps port - " + error.message);
        });
        serialPort.open(function(error) {
            if (error) {
                setGpsPortState(false);
                log("Error opening gps port: " + error.message);
            } else {
                setGpsPortState(true);
                log("gps port opened");
            }
        });
    } catch (error) {
        log("Error Opening Serial Port: gps\n Error: " + error);
    }
    if (webAppUpdateRate > 0) {
        setInterval(function() {
            updateWebApp();
        }, webAppUpdateRate);
    }
}
function updateWebApp() {
    if (gpsPortState === true) socketIO.emit("gps", currentGPSData);
}
var gpsDataReceived = function(gpsString) {
    if (gpsString.includes("$GNRMC") === true || gpsString.includes("$GPRMC") === true) {
        var parsedData = GPS_PARSER.Parse(gpsString);
        currentGPSData = {
            valid: parsedData.valid,
            timedate: parsedData.time,
            latitude: parsedData.lat + _config.GPS_LATITUDE_OFFSET,
            longitude: parsedData.lon + _config.GPS_LONGITUDE_OFFSET,
            speed: parsedData.speed,
            track: parsedData.track
        };
    }
};

//# sourceMappingURL=gps.js.map