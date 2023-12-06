//Load Modules
require('dotenv').config();
//const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const { connection } = require('./Database/postgres');
const bootStrap = require('./utils/bootstrap');
const parseAndInsertCSV = require('./utils/parsecsv-insert');
const assignment = require('./routes/assignmentRoutes');
const healthzCheck = require('./routes/healthCheckRoutes');
const helper = require('./utils/helper');
const app = express();

const { sequelize } = require('./Database/postgres');

app.use(bodyParser.json());

const listen_Port = process.env.PORT;

app.set('etag', false);

module.exports = app;
//BootStrap and LOAD CSV
const res = parseAndInsertCSV();
if (!res) {
  console.log('Users csv file not Found at ../opt directory');
}

//API FOR ASSIGNMENTS
app.use('/demo/assignments', assignment);
//API ENDPOINTS FOR healthz
app.use('/healthz', healthzCheck);
app.patch('/*', (req, res) => {
  helper.logger.info('Method Not Allowed');

  return res.status(405).json({
    message: 'Method Not Allowed',
  });
});
app.options('/*', (req, res) => {
  helper.logger.info('Method Not Allowed');
  return res.status(405).json({
    message: 'Method Not Allowed',
  });
});

app.post('/*', (req, res) => {
  return res.status(404).json({
    message: 'Resource Not Found',
  });
});

//REMOVED OCT 3 6:55PM
/*app.put('/*', (req, res) => {
  return res.status(404).json({
    message: 'Resource Not Found',
  });
});*/
app.delete('/*', (req, res) => {
  return res.status(404).json({
    message: 'Resource Not Found',
  });
});

/*REMOVE TEMP
app.get('/*', (req, res) => {
  return res.status(404).json({
    message: 'Resource Not Found',
  });
});*/

app.listen(listen_Port, () => {
  console.log(`Listening to port ${listen_Port}`);
  //await sequelize.sync();
});

process.on('terminate', () => {
  process.on('terminate', () => {
    // run after all terminate handlers that were added before exit
    console.log('exit');
    helper.logger.info('Terminate -Exit');
    helper.statsdClient.socket.close();
  });
});
