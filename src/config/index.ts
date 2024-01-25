
import { existsSync, readFileSync, writeFile, appendFile } from "fs";
import { config as readDotEnv} from "dotenv";

import { log as serverLog} from "@utils/logger";

const option_file = 'blackbox.options';

// General settings
let LOCATION_UPDATE_RATE=1000
let GPS_PROCESS_SPEED=.01
let SERVER_UPDATE_RATE=1000
let USING_METRIC=true;

let SERVER_PORT='8081'
let LOG_FORMAT='dev'
let LOG_DIRECTORY='./logs'

// GPS port-/dev/tty-HoluxGPS
let GPS_PORT='/dev/ttyUSB2'
let GPS_BAUDRATE=115200
let GPS_LATITUDE_OFFSET=0
let GPS_LONGITUDE_OFFSET=0

// Vaisala port-/dev/tty-Vaisala
let VAISALA_PORT='/dev/ttyUSB1'
let VAISALA_BAUDRATE=9600

// Bowmonk port--/dev/tty-Bowmonk
let BOWMONK_PORT='/dev/ttyUSB0'
let BOWMONK_BAUDRATE=9600
let BOWMONK_COMMAND_PAUSE = 5;
let BOWMONK_TIMEOUT = 500;


let RSC_READING_MAX_AGE = 30; // minutes

const INVALID_TEMPERATURE = -66;
const INVALID_FRICTION = -1;
let AIRPORT_CODE='XXX'

const { NODE_ENVIRONMENT, } = process.env;




readDotEnv(); // read environment variables

function log (message)
{
    serverLog(message);
}

function fileError (error)
{
    if (error)
        console.log('Error adding default option');

}

async function setupConfiguration()
{


    try {

      // create default options file entries, if one doesn't exist
      if (existsSync(option_file) === false) {

         log('default options file needs to be created');
          await writeFile(option_file, '// Blackbox Options\n\n', function (error) {
              if (error)
                   log('Error creating option file: ' + error);
              else
                  log('Options File Created');
          });

          await appendFile(option_file, '\n// General Options' + '\n', (error) => fileError(error));
          await appendFile(option_file, 'AirportCode='         + AIRPORT_CODE         + '\n', (error) => fileError(error));
          await appendFile(option_file, 'ServerUpdateRate='    + SERVER_UPDATE_RATE   + '\n', (error) => fileError(error));
          await appendFile(option_file, 'UsingMetric='         + USING_METRIC         + '\n', (error) => fileError(error));
          await appendFile(option_file, 'LocationUpdateRate='  + LOCATION_UPDATE_RATE + '\n', (error) => fileError(error));
          await appendFile(option_file, 'GpsProcessSpeed='     + GPS_PROCESS_SPEED    + '\n', (error) => fileError(error));
          await appendFile(option_file, 'ServerPort='          + SERVER_PORT          + '\n', (error) => fileError(error));
          await appendFile(option_file, 'LogFormat='           + LOG_FORMAT           + '\n', (error) => fileError(error));
          await appendFile(option_file, 'LogDirectory='        + LOG_DIRECTORY        + '\n', (error) => fileError(error));
          await appendFile(option_file, 'rscReadingMaxAge='    + RSC_READING_MAX_AGE  + '\n', (error) => fileError(error));


          await appendFile(option_file, '\n// GPS Options'     + '\n', (error) => fileError(error));
          await appendFile(option_file, 'GpsPort='             + GPS_PORT             + '\n', (error) => fileError(error));
          await appendFile(option_file, 'GpsBaudrate='         + GPS_BAUDRATE         + '\n', (error) => fileError(error));
          await appendFile(option_file, 'LatitudeOffset='      + GPS_LATITUDE_OFFSET  + '\n', (error) => fileError(error));
          await appendFile(option_file, 'LongitudeOffset='     + GPS_LONGITUDE_OFFSET + '\n', (error) => fileError(error));

          await appendFile(option_file, '\n// Bowmonk Options' + '\n', (error) => fileError(error));
          await appendFile(option_file, 'BowmonkPort='         + BOWMONK_PORT          + '\n', (error) => fileError(error));
          await appendFile(option_file, 'BowmonkBaudrate='     + BOWMONK_BAUDRATE      + '\n', (error) => fileError(error));
          await appendFile(option_file, 'BowmonkCommandPause=' + BOWMONK_COMMAND_PAUSE + '\n', (error) => fileError(error));
          await appendFile(option_file, 'BowmonkTimeout='      + BOWMONK_TIMEOUT       + '\n', (error) => fileError(error));

          await appendFile(option_file, '\n// Vaisala Options' + '\n', (error) => fileError(error));
          await appendFile(option_file, 'VaisalaPort='         + BOWMONK_PORT         + '\n', (error) => fileError(error));
          await appendFile(option_file, 'VaisalaBaudrate='     + VAISALA_BAUDRATE      + '\n', (error) => fileError(error));


          log('- \'' + option_file + '\' default options added');

      }

      // read options file
      try {

        const data = readFileSync(option_file);
        const dataLines = data.toString('utf8').split('\n');
        dataLines.forEach (line => {

          if (line.includes ('AirportCode'))        AIRPORT_CODE           =line.split('=')[1]
          if (line.includes ('ServerUpdateRate'))   SERVER_UPDATE_RATE     =parseInt(line.split('=')[1])
          if (line.includes ('UsingMetric'))        USING_METRIC           =parseInt(line.split('=')[1]) > 0;

          if (line.includes ('LocationUpdateRate')) LOCATION_UPDATE_RATE   =parseInt(line.split('=')[1])
          if (line.includes ('GpsProcessSpeed'))    GPS_PROCESS_SPEED      =parseInt(line.split('=')[1])
          if (line.includes ('ServerPort'))         SERVER_PORT            =line.split('=')[1]
          if (line.includes ('LogFormat'))          LOG_FORMAT             =line.split('=')[1]
          if (line.includes ('LogDirectory'))       LOG_DIRECTORY          =line.split('=')[1]
          if (line.includes ('rscReadingMaxAge'))   RSC_READING_MAX_AGE    =parseInt(line.split('=')[1])


          if (line.includes ('GpsPort'))            GPS_PORT               =line.split('=')[1]
          if (line.includes ('GpsBaudrate'))        GPS_BAUDRATE           =parseInt(line.split('=')[1])
          if (line.includes ('LatitudeOffset'))     GPS_LATITUDE_OFFSET    =parseInt(line.split('=')[1])
          if (line.includes ('LongitudeOffset'))    GPS_LONGITUDE_OFFSET   =parseInt(line.split('=')[1])

          if (line.includes ('BowmonkPort'))         BOWMONK_PORT          =line.split('=')[1]
          if (line.includes ('BowmonkBaudrate'))     BOWMONK_BAUDRATE      =parseInt(line.split('=')[1])
          if (line.includes ('BowmonkCommandPause')) BOWMONK_COMMAND_PAUSE =parseInt(line.split('=')[1])
          if (line.includes ('BowmonkTimeout'))      BOWMONK_TIMEOUT       =parseInt(line.split('=')[1])

          if (line.includes ('VaisalaPort'))         VAISALA_PORT          =line.split('=')[1]
          if (line.includes ('VaisalaBaudrate'))     VAISALA_BAUDRATE      =parseInt(line.split('=')[1])

        });

      }
      catch (error) {
         console.log('Error adding default option');
      }

      log('');
      log('General Options');
      log('  Airport Code: '         + AIRPORT_CODE);
      log('  Server Update Rate: '   + SERVER_UPDATE_RATE);
      log('  Using Metric: '         + USING_METRIC);

      log('  Location Update Rate: ' + LOCATION_UPDATE_RATE);
      log('  GPS Process Speed: '    + GPS_PROCESS_SPEED);
      log('  Server Port: '          + SERVER_PORT);
      log('  Log Format: '           + LOG_FORMAT);
      log('  Log Directory: '        + LOG_DIRECTORY);
      log('  RSC Reading Max Age: '  + RSC_READING_MAX_AGE + ' minutes');
      log('');

      log('GPS Options');
      log('  Port: '                 + GPS_PORT);
      log('  Baud: '                 + GPS_BAUDRATE);
      log('  Lat Offset: '           + GPS_LATITUDE_OFFSET);
      log('  Long Offset: '          + GPS_LONGITUDE_OFFSET);
      log('');

      log('Bowmonk Options');
      log('  Port: '                 + BOWMONK_PORT);
      log('  Baud: '                 + BOWMONK_BAUDRATE);
      log('  Command Pause (msec): ' + BOWMONK_COMMAND_PAUSE);
      log('  Timeout (msec): '       + BOWMONK_TIMEOUT);
      log('');

      log('Vaisala Options');
      log('  Port: '                 + VAISALA_PORT);
      log('  Baud: '                 + VAISALA_BAUDRATE);


    }
    catch (error) {
      log('\nError creating default options file: blackbox_options');
      log('Error: ' + error);
    }

}

export { NODE_ENVIRONMENT, SERVER_PORT, LOG_FORMAT, LOG_DIRECTORY, setupConfiguration,
         AIRPORT_CODE, USING_METRIC, RSC_READING_MAX_AGE,
         VAISALA_PORT, VAISALA_BAUDRATE, INVALID_TEMPERATURE,
         BOWMONK_PORT, BOWMONK_BAUDRATE, BOWMONK_COMMAND_PAUSE, BOWMONK_TIMEOUT, INVALID_FRICTION,
         GPS_PORT, GPS_BAUDRATE, GPS_LATITUDE_OFFSET, GPS_LONGITUDE_OFFSET, LOCATION_UPDATE_RATE, GPS_PROCESS_SPEED, SERVER_UPDATE_RATE}



