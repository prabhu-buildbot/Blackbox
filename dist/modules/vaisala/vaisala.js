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
    vaisalaPortSetup: function() {
        return vaisalaPortSetup;
    },
    vaisalaPortState: function() {
        return vaisalaPortState;
    },
    setVaisalaPortState: function() {
        return setVaisalaPortState;
    },
    ambientTemperature: function() {
        return ambientTemperature;
    }
});
var _serialport = require("serialport");
var _parserreadline = require("@serialport/parser-readline");
var _logger = require("../../utils/logger");
var _config = require("../../config");
var serialPort = null;
var UNSET_VALUE = -1;
var ambientTemperature = _config.INVALID_TEMPERATURE;
var vaisalaPortState = false;
var socketIO = null;
function setVaisalaPortState(state) {
    vaisalaPortState = state;
}
function log(message) {
    (0, _logger.log)("vaisala > " + message);
}
function vaisalaPortSetup(serverSocketIO) {
    ambientTemperature = _config.INVALID_TEMPERATURE;
    socketIO = serverSocketIO;
    try {
        log("Opening vaisala port: " + _config.VAISALA_PORT + " @ baudrate: " + _config.VAISALA_BAUDRATE);
        var readlineParser = new _parserreadline.ReadlineParser();
        readlineParser.on("data", vaisalaDataReceived);
        serialPort = new _serialport.SerialPort({
            path: _config.VAISALA_PORT,
            baudRate: _config.VAISALA_BAUDRATE,
            autoOpen: false
        });
        serialPort.pipe(readlineParser);
        serialPort.on("error", function(error) {
            log("Error on vaisala port - " + error.message);
        });
        serialPort.open(function(error) {
            if (error) {
                setVaisalaPortState(false);
                log("Error opening vaisala port: " + error.message);
            } else {
                setVaisalaPortState(true);
                log("vaisala port opened");
            }
        });
    } catch (error) {
        log("Error Opening Serial Port: vaisala\n Error: " + error);
    }
}
var vaisalaDataReceived = function(vaisalaString) {
    try {
        var isCelciusReading = vaisalaString.toLowerCase().indexOf("c") > UNSET_VALUE;
        var rawNumbers = vaisalaString.substring(1).split(",");
        var tempNumber = parseFloat(rawNumbers[0]);
        if (isNaN(tempNumber) === false) ambientTemperature = tempNumber;
        if (_config.USING_METRIC === true) {
            if (isCelciusReading === false) ambientTemperature = fahrenheitToCelcius(ambientTemperature);
        } else {
            if (isCelciusReading == true) ambientTemperature = celciusToFahrenheit(ambientTemperature);
        }
    } catch (e) {
        ambientTemperature = _config.INVALID_TEMPERATURE;
    }
};
function fahrenheitToCelcius(fahrenheitTemperature) {
    return (fahrenheitTemperature - 32) * 5 / 9;
}
function celciusToFahrenheit(celciusTemperature) {
    return celciusTemperature * 9 / 5 + 32;
}

//# sourceMappingURL=vaisala.js.map