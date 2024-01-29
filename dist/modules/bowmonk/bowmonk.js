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
    bowmonkPortState: function() {
        return bowmonkPortState;
    },
    bowmonkPortSetup: function() {
        return bowmonkPortSetup;
    },
    bowmonkReadings: function() {
        return bowmonkReadings;
    }
});
var _serialport = require("serialport");
var _logger = require("../../utils/logger");
var _vaisala = require("../vaisala/vaisala");
var _gps = require("../gps/gps");
var _config = require("../../config");
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
var UNSET_VALUE = -1;
var serialPort = null;
var socketIO = null;
var bowmonkReadings = [];
var BOWMONK_PREFIX = "!0000";
var COMMAND_READ_MEMORY = "1";
var COMMAND_REARM_SYSTEM = "A";
var COMMAND_RESET_SYSTEM = "B";
var RAM_BASE_ADDRESS = 263;
var COMMAND_ERROR = "Command Error: ";
var bowmonkPortState = false;
var acquiringBowmonkReading = false;
var bowmonkArmed = false;
var bowmonkReadingAvailable = false;
var flags = [];
var mean;
var peak;
function log(message) {
    (0, _logger.log)("bowmonk > " + message);
}
function setBowmonkPortState(state) {
    bowmonkPortState = state;
}
function bowmonkPortSetup(serverSocketIO) {
    try {
        log("Opening bowmonk port: " + _config.BOWMONK_PORT + " @ baudrate: " + _config.BOWMONK_BAUDRATE);
        serialPort = new _serialport.SerialPort({
            path: _config.BOWMONK_PORT,
            baudRate: _config.BOWMONK_BAUDRATE,
            autoOpen: false
        });
        socketIO = serverSocketIO;
        serialPort.on("data", bowmonkDataReceived);
        serialPort.on("error", function(error) {
            log("Error on bowmonk port - " + error.message);
        });
        serialPort.open(function(error) {
            if (error) {
                setBowmonkPortState(false);
                log("Error opening bowmonk port: " + error.message);
            } else {
                setBowmonkPortState(true);
                log("bowmonk port opened");
                setInterval(function() {
                                        log(bowmonkReadingAvailable);
                    if (bowmonkReadingAvailable === false) {
                        log("Bowmonk reading available");
                        lookForBowmonkReading();
                    }
                }, 500);
            }
        });
    } catch (error) {
        log("Error opening bowmonk port - Error: " + error);
    }
}
function bowmonkDataReceived(bowmonkDataString) {
    try {
        if (bowmonkDataString.includes("#") == true) {
            bowmonkArmed = false;
            bowmonkReadingAvailable = true;
            log("Bowmonk data received - Reading available");
        }
        if (bowmonkDataString.includes("*") == true) {
            bowmonkReadingAvailable = false;
            bowmonkArmed = true;
            console.log("*");
        }
    } catch (error) {
        log("Bowmonk port reading error: " + error);
        bowmonkReadingAvailable = false;
        bowmonkArmed = false;
    }
    var bowmonkStatus = {
        initialized: bowmonkPortState,
        armed: bowmonkArmed,
        readingAvailable: bowmonkReadingAvailable
    };
    if (bowmonkPortState === true) socketIO.emit("bowmonk", bowmonkStatus);
}
function sendCommand(bowmonkCommand) {
    return _sendCommand.apply(this, arguments);
}
function _sendCommand() {
    _sendCommand = _async_to_generator(function(bowmonkCommand) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        serialPort.flush()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2,
                        new Promise(function(resolve, reject) {
                            var responseData = "";
                            var sendTimeout = setTimeout(function() {
                                removeTemporaryListeners();
                                reject(COMMAND_ERROR + "timeout");
                            }, _config.BOWMONK_TIMEOUT);
                            var errorHandler = function(error) {
                                removeTemporaryListeners();
                                reject(COMMAND_ERROR + error);
                            };
                            var dataHandler = function(data) {
                                responseData += data.toString();
                                if (responseData.includes("\r")) {
                                    clearTimeout(sendTimeout);
                                    removeTemporaryListeners();
                                    resolve(responseData);
                                }
                            };
                            var removeTemporaryListeners = function() {
                                serialPort.removeListener("data", dataHandler);
                                serialPort.removeListener("error", errorHandler);
                            };
                            serialPort.on("data", dataHandler);
                            serialPort.on("error", errorHandler);
                            serialPort.write(bowmonkCommand, function(error) {
                                if (error) {
                                    removeTemporaryListeners();
                                    reject(COMMAND_ERROR + error);
                                }
                            });
                        })
                    ];
            }
        });
    });
    return _sendCommand.apply(this, arguments);
}
function sendCommand_ReadMemoryFromRAMBase(offset) {
    return _sendCommand_ReadMemoryFromRAMBase.apply(this, arguments);
}
function _sendCommand_ReadMemoryFromRAMBase() {
    _sendCommand_ReadMemoryFromRAMBase = _async_to_generator(function(offset) {
        var address, bowmonkCommand, commandResponse;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    address = RAM_BASE_ADDRESS + offset;
                    bowmonkCommand = BOWMONK_PREFIX + COMMAND_READ_MEMORY + address.toString(16).toUpperCase().padStart(4, 0) + "\r";
                    log("Test Number BowmonkCommand" + bowmonkCommand);
                    return [
                        4,
                        sendCommand(bowmonkCommand)
                    ];
                case 1:
                    commandResponse = _state.sent();
                    log("Command Response"  + commandResponse);
                    return [
                        2,
                        commandResponse
                    ];
            }
        });
    });
    return _sendCommand_ReadMemoryFromRAMBase.apply(this, arguments);
}
function GetNextTestNumber() {
    return _GetNextTestNumber.apply(this, arguments);
}
function _GetNextTestNumber() {
    _GetNextTestNumber = _async_to_generator(function() {
        var nextTestNumber, commandResponse;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    nextTestNumber = UNSET_VALUE;
                    return [
                        4,
                        sendCommand_ReadMemoryFromRAMBase(0)
                    ];
                case 1:
                    commandResponse = _state.sent();
                    if (commandResponse.includes(COMMAND_ERROR) === false) {
                        if (commandResponse.length == 0) return [
                            2,
                            UNSET_VALUE
                        ];
                        if (commandResponse.length != 76 && commandResponse.length != 77) return [
                            2,
                            UNSET_VALUE
                        ];
                        if (commandResponse.substring(0, 6).toLowerCase().includes(":31a01") == false) return [
                            2,
                            UNSET_VALUE
                        ];
                        try {
                            nextTestNumber = parseInt(commandResponse.substring(12, 12 + 2), 16);
                            log("Reading the repsonse and etarcting the test NUmber" + nextTestNumber)
                        } catch (e) {
                            nextTestNumber = UNSET_VALUE;
                        }
                    }
                    return [
                        2,
                        nextTestNumber
                    ];
            }
        });
    });
    return _GetNextTestNumber.apply(this, arguments);
}
function pressAcceptKey(showMsg) {
    return _pressAcceptKey.apply(this, arguments);
}
function _pressAcceptKey() {
    _pressAcceptKey = _async_to_generator(function(showMsg) {
        var acceptKeySucessful, bowmonkCommand, commandResponse;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    acceptKeySucessful = false;
                    bowmonkCommand = BOWMONK_PREFIX + COMMAND_REARM_SYSTEM + "\r";
                    return [
                        4,
                        sendCommand(bowmonkCommand)
                    ]; 
                case 1:
                    commandResponse = _state.sent();
                    if (commandResponse.includes(COMMAND_ERROR) === false) {
                        acceptKeySucessful = commandResponse.toLowerCase().includes(":31a0a");
                        if (showMsg == true && acceptKeySucessful == false) console.log("Unsuccessful Accept Key: " + commandResponse);
                    } else console.log("Unsuccessful Accept Key: " + commandResponse);
                    return [
                        2,
                        acceptKeySucessful
                    ];
            }
        });
    });
    return _pressAcceptKey.apply(this, arguments);
}
function getTestDataAddressNumber(testNumber) {
    return _getTestDataAddressNumber.apply(this, arguments);
}
function _getTestDataAddressNumber() {
    _getTestDataAddressNumber = _async_to_generator(function(testNumber) {
        var dataAddress, commandResponse, firstByte, secondByte;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    dataAddress = UNSET_VALUE;
                    return [
                        4,
                        sendCommand_ReadMemoryFromRAMBase(testNumber)
                    ];
                case 1:
                    commandResponse = _state.sent();
                    if (commandResponse.includes(COMMAND_ERROR) === false) {
                        if (commandResponse.length == 0) return [
                            2,
                            UNSET_VALUE
                        ];
                        if (commandResponse.length != 76 && commandResponse.length != 77) return [
                            2,
                            UNSET_VALUE
                        ];
                        if (commandResponse.substring(0, 6).toLowerCase().includes(":31a01") == false) return [
                            2,
                            UNSET_VALUE
                        ];
                        try {
                            firstByte = parseInt(commandResponse.substring(10, 10 + 2), 16);
                            secondByte = parseInt(commandResponse.substring(12, 12 + 2), 16);
                            dataAddress = firstByte * 256 + secondByte;
                            log("DATAADDRESS IN BYTES" + dataAddress);
                        } catch (e) {
                            dataAddress = UNSET_VALUE;
                        }
                    }
                    return [
                        2,
                        dataAddress
                    ];
            }
        });
    });
    return _getTestDataAddressNumber.apply(this, arguments);
}
function  getBowmonkTestData(testDataAddress) {
    return _getBowmonkTestData.apply(this, arguments);
}
function _getBowmonkTestData() {
    _getBowmonkTestData = _async_to_generator(function(testDataAddress) {
        var readSucessful, bowmonkCommand, commandResponse, firstByte, secondByte;
        return _ts_generator(this, function(_state) {
            log("I am Entering _getBowmonkTestData fucntion ")
            log(_state.label)
            switch(_state.label){
                case 0:
                    readSucessful = true;
                    log("Test Data Address:", this.testDataAddress);
                    bowmonkCommand = BOWMONK_PREFIX + COMMAND_READ_MEMORY + testDataAddress.toString(16).toUpperCase().padStart(4, 0) + "\r";
                    log("Bowmonk test data Command",bowmonkCommand);
                    return [
                        4,
                        log("I am in Return"),
                        sendCommand(bowmonkCommand)
                    ];
                case 1:
                    commandResponse = _state.sent();
                    log(commandResponse);
                    if (commandResponse.includes(COMMAND_ERROR) === false) {
                        if (commandResponse.length == 0) return [
                            2,
                            false
                        ];
                        if (commandResponse.length != 76 && commandResponse.length != 77) return [
                            2,
                            false  
                        ];
                        if (commandResponse.substring(0, 6).toLowerCase().includes(":31a01") == false) return [
                            2,
                            false
                        ];
                        try {
                            flags = [];
                            flags.push(parseInt(commandResponse.substring(12, 12 + 2), 16));
                            flags.push(parseInt(commandResponse.substring(10, 10 + 2), 16));
                            flags.push(parseInt(commandResponse.substring(16, 16 + 2), 16));
                            flags.push(parseInt(commandResponse.substring(14, 14 + 2), 16));
                            firstByte = parseInt(commandResponse.substring(46, 46 + 2), 16);
                            secondByte = parseInt(commandResponse.substring(48, 48 + 2), 16);
                            mean = (firstByte * 256 + secondByte) / 10.0;
                            mean /= 100;
                            firstByte = parseInt(commandResponse.substring(42, 42 + 2), 16);
                            log(firstByte);
                            secondByte = parseInt(commandResponse.substring(44, 44 + 2), 16);
                            log(secondByte);
                            peak = (firstByte * 256 + secondByte) / 10.0;
                            peak /= 100;
                            log(peak);
                            readSucessful = true;
                        } catch (e) {
                            readSucessful = false;
                        }
                    } else readSucessful = false;
                    return [
                        2,
                        readSucessful
                    ];
            }
        });
    });
    return _getBowmonkTestData.apply(this, arguments);
}
function delay(delayMs) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, delayMs);
    });
}
function lookForBowmonkReading() {
    return _lookForBowmonkReading.apply(this, arguments);
}
function _lookForBowmonkReading() {
    _lookForBowmonkReading = _async_to_generator(function() {
        var acceptKeySucessful, nextTestNumber, testNumber, testDataAddress, testDataObtained, bowmonkReading, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (acquiringBowmonkReading === true) return [
                        2,
                        log("case" + _state.label)
                    ];
                    acquiringBowmonkReading = true;
                    bowmonkReadingAvailable = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        29,
                        30, 
                        31
                    ]);
                    return [
                        4,
                        pressAcceptKey(true),
                        log("case" + _state.label)
                    ];
                case 2:
                    acceptKeySucessful = _state.sent();
                    if (!(acceptKeySucessful == false)) return [
                        3,
                        5
                    ];
                    log("First Accept Key FAILED - Trying Again");
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE)
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        pressAcceptKey(true),
                        log("case" + _state.label)
                    ];
                case 4:
                    acceptKeySucessful = _state.sent();
                    if (acceptKeySucessful === false) log("1 Retry Accept Key FAILED");
                    _state.label = 5;
                case 5:
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE),
                        log("case" + _state.label)
                    ];
                case 6:
                    _state.sent();
                    return [
                        4,
                        GetNextTestNumber(),
                        log("GetNextTestNumber" + _state.label),
                        log("case" + _state.label)
                    ];
                case 7:
                    nextTestNumber = _state.sent();
                    if (!(nextTestNumber === UNSET_VALUE)) return [
                        3,
                        10
                    ];
                    log("getNextTestNumber() Failed - Trying Again");
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE),
                        log("case" + _state.label)
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        GetNextTestNumber(),
                        log("Getting NextTest Number"),
                        log("case" + _state.label)
                    ];
                case 9:
                    nextTestNumber = _state.sent();
                    log("case" + _state.label)
                    _state.label = 10;
                case 10:
                    if (!(nextTestNumber !== UNSET_VALUE)) return [
                        3,
                        23
                    ];
                    testNumber = nextTestNumber - 1;
                    log("TestNumber - 1" , testNumber);
                    log("case" + _state.label)
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE)
                    ];
                case 11:
                    _state.sent();
                    return [
                        4,
                        log("Getting Test Data Address Number and test number is " + testNumber ),
                        getTestDataAddressNumber(testNumber),
                        log("case" + _state.label)
                    ];
                case 12:
                    testDataAddress = _state.sent();
                    if (!(testDataAddress === UNSET_VALUE)) return [
                        3,
                        15
                    ];
                    log("getTestDataAddressNumber() Failed - Trying Again");
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE),
                        log("case" + _state.label)
                    ];
                case 13:
                    _state.sent();
                    return [
                        4,
                        getTestDataAddressNumber(testNumber),
                        log("case" + _state.label)
                    ];
                case 14:
                    testDataAddress = _state.sent();
                    log("Case " + 14)
                    log("Got Test DATA Address" + testDataAddress)
                    _state.label = 15;
                case 15:
                    if (!(testDataAddress !== UNSET_VALUE)) return [
                        3,
                        21
                    ];
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE)
                    ];
                case 16:
                    _state.sent();
                    return [
                        4,
                        log(testDataAddress + "  test data address"),
                        getBowmonkTestData(testDataAddress),
                        log("case" + _state.label)
                        
                    ];
                case 17:
                    testDataObtained = _state.sent();
                    if (!(testDataObtained === false)) return [
                        3,
                        20
                    ];
                    log("getBowmonkTestData() Failed - Trying Again");
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE)
                    ];
                case 18:
                    _state.sent();
                    return [
                        4,
                        getBowmonkTestData(testDataAddress),
                        log("case" + _state.label)

                    ];
                case 19:
                    testDataObtained = _state.sent();
                    log("testdataObtAINED",testDataObtained)
                    _state.label = 20;
                case 20:
                    log("Case" + _state.label)
                    if (testDataObtained === true) {
                        log("Entered");
                        if (peak >= .01 && peak <= .99) {
                            log(peak);
                            if (_gps.gpsPortState === true && _gps.currentGPSData.valid === true) {
                                bowmonkReading = {
                                    readingTime: _gps.currentGPSData.timedate,
                                    latitude: _gps.currentGPSData.latitude,
                                    longitude: _gps.currentGPSData.longitude,
                                    friction: peak,
                                    ambient: _vaisala.ambientTemperature
                                };
                                bowmonkReadings.push(bowmonkReading);
                                log("Pushing: " + JSON.stringify(bowmonkReading));
                            } else log("GPS reading unavailable - Port Open: " + _gps.gpsPortState + ", valid: " + _gps.currentGPSData.valid);
                        } else log("Reading Outside Range: " + peak);
                    } else log("getBowmonkTestData() Failed");
                    return [
                        3,
                        22
                    ];
                case 21:
                    log("Could Not Get Test Data Address");
                    _state.label = 22;
                case 22:
                    return [
                        3,
                        24
                    ];
                case 23:
                    log("Could Not Get Next Test Number");
                    _state.label = 24;
                case 24:
                    return [
                        4,
                        delay(_config.BOWMONK_COMMAND_PAUSE)
                    ];
                case 25:
                    _state.sent();
                    return [
                        4,
                        pressAcceptKey(true),
                        log("case" + _state.label)
                    ];
                case 26:
                    acceptKeySucessful = _state.sent();
                    if (!(acceptKeySucessful == false)) return [
                        3,
                        28
                    ];
                    log("Second Accept Key FAILED - Trying Again");
                    return [
                        4,
                        pressAcceptKey(true)
                    ];
                case 27:
                    acceptKeySucessful = _state.sent();
                    acceptKeySucessful = pressAcceptKey(true);
                    if (acceptKeySucessful == false) log("2 Retry Accept Key FAILED");
                    _state.label = 28;
                case 28:
                    return [
                        3,
                        31
                    ];
                case 29:
                    error = _state.sent();
                    log("_state data::::::::" + _state)
                    log("_state Objectdata::::::::" + JSON.stringify(_state));

                    log("lookForBowmonkReading() Error: " + error);
                    return [
                        3,
                        31
                    ];
                case 30:
                    acquiringBowmonkReading = false;
                    return [
                        7
                    ];
                case 31:
                    return [
                        2
                    ];
            }
        });
    });
    return _lookForBowmonkReading.apply(this, arguments);
}

//# sourceMappingURL=bowmonk.js.map