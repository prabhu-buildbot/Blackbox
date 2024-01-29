"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "serialPortSetup", {
    enumerable: true,
    get: function() {
        return serialPortSetup;
    }
});
var _serialport = require("serialport");
var _parserreadline = require("@serialport/parser-readline");
var _logger = require("./logger");
var logSource = "serialPort";
var serialPort = null;
function log(message) {
    (0, _logger.log)(logSource + " > " + message);
}
var showData = function(dataString) {
    log(dataString);
};
function serialPortSetup(source, port, baudrate, setPortState, dataReceived) {
    logSource = source;
    try {
        log("Opening " + source + " port: " + port + " @ baudrate: " + baudrate);
        var readlineParser = new _parserreadline.ReadlineParser();
        readlineParser.on("data", dataReceived);
        serialPort = new _serialport.SerialPort({
            path: port,
            baudRate: baudrate,
            autoOpen: false
        });
        serialPort.pipe(readlineParser);
        serialPort.open(function(error) {
            if (error) {
                setPortState(false);
                log(error.message);
            } else {
                setPortState(true);
                log(source + " port opened");
            }
        });
        serialPort.on("error", function(error) {
            log("Error on " + source + " port");
            log(" - " + error.message);
        });
    } catch (error) {
        log("Error Opening Serial Port: " + source + "\n Error: " + error);
    }
}

//# sourceMappingURL=serialPort.js.map