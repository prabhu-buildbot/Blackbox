"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _serialport = require("serialport");
var _socketio = require("socket.io");
var _bowmonk = require("./modules/bowmonk/bowmonk");
var _http = _interop_require_wildcard(require("http"));
var _express = _interop_require_default(require("express"));
var _index = require("./config/index");
var _logger = require("./utils/logger");
var _gpsRoutes = _interop_require_default(require("./modules/gps/gpsRoutes"));
var _bowmonkRoutes = _interop_require_default(require("./modules/bowmonk/bowmonkRoutes"));
var _vaisalaRoutes = _interop_require_default(require("./modules/vaisala/vaisalaRoutes"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
var softwareVersion = "1.0.2";
var nodeEnvironment = _index.NODE_ENVIRONMENT || "production";
var serverPort = _index.SERVER_PORT || 3000;
function log(message) {
    (0, _logger.log)(message);
}
console.log(":::::::::BOWMONK_PORT", _index.BOWMONK_PORT);
console.log(":::::::::GPS_PORT", _index.GPS_PORT);
console.log(":::::::::VAISALA_PORT", _index.VAISALA_PORT);
var expressApp = (0, _express.default)();
expressApp.use(_express.default.json({
    limit: "1mb"
}));
expressApp.use(_express.default.urlencoded({
    extended: true
}));
expressApp.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-client, x-auth, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
expressApp.use("/api/gps", _gpsRoutes.default);
expressApp.use("/api/bowmonk", _bowmonkRoutes.default);
expressApp.use("/api/vaisala", _vaisalaRoutes.default);
expressApp.use(function(request, result, next) {
    log("Unhandled Request: " + request.url + " " + request.method);
    result.status(404).send("Request not found");
});
function availableSerialPorts() {
    return _availableSerialPorts.apply(this, arguments);
}
function _availableSerialPorts() {
    _availableSerialPorts = _async_to_generator(function() {
        var portList, availablePorts;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    portList = "";
                    return [
                        4,
                        _serialport.SerialPort.list()
                    ];
                case 1:
                    availablePorts = _state.sent();
                    availablePorts.forEach(function(port) {
                        return portList += port.path + ", ";
                    });
                    return [
                        2,
                        portList.length > 0 ? portList.substring(0, portList.length - 2) : "No Ports Found"
                    ];
            }
        });
    });
    return _availableSerialPorts.apply(this, arguments);
}
function StartServer() {
    return _StartServer.apply(this, arguments);
}
function _StartServer() {
    _StartServer = _async_to_generator(function() {
        var httpServer, socketIO;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!((0, _logger.setupLogging)(_index.LOG_DIRECTORY) === true)) return [
                        3,
                        2
                    ];
                    log("");
                    log("Blackbox API starting ...");
                    log("- version: " + softwareVersion);
                    log("- using NODE_ENVIRONMENT: " + nodeEnvironment);
                    log("");
                    return [
                        4,
                        (0, _index.setupConfiguration)()
                    ];
                case 1:
                    _state.sent();
                    httpServer = _http.createServer(expressApp);
                    socketIO = new _socketio.Server(httpServer, {
                        cors: {
                            origin: "*"
                        }
                    });
                    expressApp.set("socketio", socketIO);
                    socketIO.on("connection", function(socket) {
                        log("socketIO - a user connected");
                        socket.on("disconnect", function() {
                            log("socketIO - user disconnected");
                        });
                        socket.on("connect_error", function(error) {
                            log("socketIO - connect_error due to: " + error.message + ", " + error);
                        });
                        socket.on("join", function(airportCode) {
                            log("socketIO - request to join room");
                            socket.join(airportCode);
                        });
                    });
                    httpServer.listen(serverPort, _async_to_generator(function() {
                        var bowmonkSetupInterval;
                        return _ts_generator(this, function(_state) {
                            log("- listening on server port: " + serverPort);
                            log("");
                            bowmonkSetupInterval = null;
                            bowmonkSetupInterval = setInterval(function() {
                                if (_bowmonk.bowmonkPortState === true && bowmonkSetupInterval !== null) {
                                    clearInterval(bowmonkSetupInterval);
                                    log("bowmonk - cancelling port open interval");
                                } else (0, _bowmonk.bowmonkPortSetup)(socketIO);
                            }, 2000);
                            return [
                                2
                            ];
                        });
                    }));
                    return [
                        3,
                        3
                    ];
                case 2:
                    console.log("Error initializing logger\n");
                    _state.label = 3;
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return _StartServer.apply(this, arguments);
}
StartServer();

//# sourceMappingURL=blackbox.js.map