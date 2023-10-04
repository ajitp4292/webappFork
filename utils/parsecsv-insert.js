const fs = require('fs');
const csv = require('csv-parser');
const { createPassHash, userIdExits } = require('../utils/helper');
const { sequelize } = require('../Database/postgres');
const intializeApp = require('../utils/bootstrap');

const userModel = sequelize.models.Account;

async function parseAndInsertCSV() {
  try {
    const appIntializeResult = await intializeApp();
    //console.log('appInit ' + appIntializeResult);

    const csvFilePath = '/opt/users.csv';
    // Validation 1: Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      console.log('File not found');
      return false;
    }
    if (appIntializeResult) {
      const parseCSV = () => {
        return new Promise((resolve, reject) => {
          const results = [];

          const csvStream = fs.createReadStream(csvFilePath);

          csvStream
            .pipe(csv())
            .on('data', (row) => {
              // Validation 2: Check if required fields are present in each row
              if (
                !row.first_name ||
                !row.last_name ||
                !row.email ||
                !row.password
              ) {
                console.log('Invalid row at row number: ' + results.length);
                return;
              }
              results.push(row);
            })
            .on('end', () => {
              resolve(results);
            })
            .on('error', (error) => {
              console.log('Error');
              reject(error);
            });
        });
      };

      const data = await parseCSV();

      // Insert each row of CSV data into the Account table
      for (const row of data) {
        let countRows = await userIdExits(row.email);
        //Insert only if no record in Account
        if (countRows === 0) {
          let hashedPassword = await createPassHash(row.password);
          ////RECENT CHANGE Oct1
          await userModel.create({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: hashedPassword,
            // Map CSV columns to model attributes as needed
          });
        }
      }
      console.log('CSV data has been parsed and inserted into the database.');
      return true;
    } else {
      console.log(
        'Database Server is down cannot parse csv and load data of users'
      );
      return false;
    }
  } catch (error) {
    console.log('Error in csv parsing and Load' + error.message);
  }
}

module.exports = parseAndInsertCSV;
