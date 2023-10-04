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
const app = express();

const { sequelize } = require('./Database/postgres');

// Use the databaseBootstrapMiddleware as the first middleware to run when the app starts
// Parse JSON request bodies
app.use(bodyParser.json());
//app.use(express.json());
const listen_Port = process.env.PORT;
//avoid etag in response
app.set('etag', false);
/*
// Call the bootStrap function to bootstrap the database

bootStrap()
  .then((result) => {
    if (result) {
      console.log('Database bootstrapped');
      // Start the Express app after the database is bootstrapped
      app.listen(listen_Port, () =>
        console.log(`Listening to port ${listen_Port}`)
      );
    } else {
      console.error('Database bootstrap failed');
    }
  })
  .catch((error) => {
    console.error('Error during database bootstrap:', error);
  });*/
module.exports = app;
//BootStrap and LOAD CSV
const res = parseAndInsertCSV();
if (!res) {
  console.log('Users csv file not Found at ../opt directory');
}

//API FOR ASSIGNMENTS
app.use('/v1/assignments', assignment);
//API ENDPOINTS FOR healthz
app.use('/healthz', healthzCheck);
app.patch('/*', (req, res) => {
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

//Main API GET EndPoint
/*
app.get('/healthz', async (req, res) => {
  console.log('INside');
  const queryParams = Object.keys(req.query);
  const queryBody = Object.keys(req.body);

  const dbConnection = await connection();
  //Remove and Set response headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');

  if (queryParams.length > 0 || queryBody.length > 0) {
    res.status(400).end();
  } else if (dbConnection) {
    res.status(200).end();
  } else if (!dbConnection) {
    res.status(503).end();
  }
});
*/

//Api Endpoint to handle unsupported methods
/*
REMOVE TEMP
app.all('/healthz', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  //console.log('Inside all for /healthz');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');
  res.status(405).end();
});*/

//Handling Invalid EndPoint
/*
app.all('/*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');
  res.status(404).end();
});*/

app.listen(listen_Port, () => {
  console.log(`Listening to port ${listen_Port}`);
  //await sequelize.sync();
});
