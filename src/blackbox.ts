
import { SerialPort } from 'serialport'
import { Server } from "socket.io";

import { gpsPortSetup, gpsPortState } from "./modules/gps/gps";
import { bowmonkPortSetup, bowmonkPortState } from "./modules/bowmonk/bowmonk";
import { vaisalaPortSetup, vaisalaPortState } from "./modules/vaisala/vaisala";
// import bowmonkRoutes from "./modules/bowmonk/bowmonkRoutes



// import compression from "compression";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import helmet from "helmet";
// import hpp from "hpp";
// import morgan from "morgan";

import * as http from "http";

import express from "express";

import { LOG_DIRECTORY, LOG_FORMAT, NODE_ENVIRONMENT, SERVER_PORT, AIRPORT_CODE, GPS_PORT, GPS_BAUDRATE, BOWMONK_PORT, BOWMONK_BAUDRATE, setupConfiguration, VAISALA_PORT } from "./config/index";
import {BOWMONK_PORT as bowmonkport} from "./config/index";

import { log as serverLog, setupLogging } from "@utils/logger";

import gpsRoutes from "./modules/gps/gpsRoutes";
import bowmonkRoutes from "./modules/bowmonk/bowmonkRoutes";
import vaisalaRoutes from "./modules/vaisala/vaisalaRoutes";

const UNSET_VALUE = -1;

const softwareVersion = '1.0.2';

const nodeEnvironment = NODE_ENVIRONMENT || "production";
const serverPort = SERVER_PORT || 3000;


function log (message)
{
    serverLog(message);
}
console.log(":::::::::BOWMONK_PORT", bowmonkport)
console.log(":::::::::GPS_PORT", GPS_PORT)
console.log(":::::::::VAISALA_PORT", VAISALA_PORT)




const expressApp = express();

// express middleware
//   expressApp.use(morgan(LOG_FORMAT, { stream }));
//   expressApp.use(cors());
//   expressApp.use(hpp());
//   expressApp.use(helmet());
//   expressApp.use(compression());
//   expressApp.use(express.json({ limit: "50mb" }));
//   expressApp.use(cookieParser());

expressApp.use(express.json({ limit: "1mb" }));
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-client, x-auth, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

// routes
expressApp.use("/api/gps", gpsRoutes);
expressApp.use("/api/bowmonk", bowmonkRoutes);
expressApp.use("/api/vaisala", vaisalaRoutes);

// if it gets here, the previous routings didn't handle the request, so error 404
expressApp.use((request, result, next) => {
    log('Unhandled Request: ' + request.url + ' ' + request.method);
    result.status(404).send('Request not found')
})


async function availableSerialPorts()
{
    // add list of COM ports to the log
    let portList = "";

    const availablePorts = await SerialPort.list();
     availablePorts.forEach(port => portList += port.path + ', ');

   return((portList.length > 0) ? portList.substring(0, portList.length-2): 'No Ports Found');

}

async function StartServer ()
{

        // setup logging and start server
        if (setupLogging(LOG_DIRECTORY) === true) {

            log('');
            log('Blackbox API starting ...');
            log('- version: ' + softwareVersion);
            log('- using NODE_ENVIRONMENT: ' + nodeEnvironment);
            log('');

            // load configuration
            await setupConfiguration();

            // setup http server and socket communications
            const httpServer = http.createServer(expressApp);

            //const socketIO = new Server(httpServer,  { cors: { origin: (environment === 'development') ? '*': ['http://localhost:' + serverPort] }, } ); // only allow local communications for production
            const socketIO = new Server(httpServer,  { cors: { origin: '*'} });
            expressApp.set('socketio', socketIO)

            socketIO.on('connection', (socket) => {

              log('socketIO - a user connected')

              socket.on('disconnect', () => {
                log('socketIO - user disconnected');
              })

              socket.on("connect_error", (error) => {
                log('socketIO - connect_error due to: ' + error.message + ', ' + error);
              });

              socket.on('join', (airportCode) => {
                log('socketIO - request to join room')
                socket.join(airportCode)
              })
            })

            // starting http server
            httpServer.listen(serverPort, async () => {

              // log('- available COM Ports: ' + await availableSerialPorts());
              log('- listening on server port: ' + serverPort);
              log('');

              // setup gps
              // let gpsSetupInterval:ReturnType<typeof setInterval> = null;
              // gpsSetupInterval = setInterval(() => {
              //                       if ((gpsPortState === true) && (gpsSetupInterval !== null)) {
              //                           clearInterval(gpsSetupInterval);
              //                           log('gps - cancelling port open interval');
              //                       }
              //                       else
              //                           gpsPortSetup(socketIO);
              //                    }, 2000);

              // setup bowmonk
              let bowmonkSetupInterval:ReturnType<typeof setInterval> = null;
              bowmonkSetupInterval = setInterval(() => {
                                        if ((bowmonkPortState === true) && (bowmonkSetupInterval !== null)) {
                                            clearInterval(bowmonkSetupInterval);
                                            log('bowmonk - cancelling port open interval');
                                        }
                                        else
                                            bowmonkPortSetup(socketIO);
                                     }, 2000);

              // setup vaisala
              // let vaisalaSetupInterval:ReturnType<typeof setInterval> = null;
              // vaisalaSetupInterval = setInterval(() => {
              //                           if ((vaisalaPortState === true) && (vaisalaSetupInterval !== null)) {
              //                               clearInterval(vaisalaSetupInterval);
              //                               log('vaisala - cancelling port open interval');
              //                           }
              //                           else
              //                               vaisalaPortSetup(socketIO)
              //                        }, 2000);

            });
        }
        else
            console.log('Error initializing logger\n');

}

StartServer();
