const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/postgres');
const { connection } = require('../Database/postgres');
//RECENT CHANGE Oct1
/*const userModel = require('../Models/user-model');
const assignmentModel = require('../Models/assignment-model');*/

async function bootStrap() {
  try {
    const dbConnection = await connection();
    // console.log('Connection to DB' + dbConnection);
    if (dbConnection) {
      // console.log('Database bootstrapped');
      /*await userModel(sequelize).sync({ force: true });
      await assignmentModel(sequelize).sync();*/
      //userModel(sequelize);
      //assignmentModel(sequelize);
      /* const userModel = sequelize.define(
        'Account',
        userModelAttributes,
        userModelOptions
      );
      const assignmentModel = sequelize.define(
        'Assignment',
        assignmentAttributes,
        assignmentOptions
      );*/
      //const Account = userModel(sequelize); // Use the userModel function
      // const Assignment = assignmentModel(sequelize);

      //console.log('inside to sequelize sync');
      //RECENT CHANGE Oct1
      await sequelize.sync({ force: false });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.error('Database bootstrap failed:', error);
    return false;
  }
}

async function intializeApp() {
  try {
    const result = await bootStrap();
    const listen_Port = process.env.PORT;
    // console.log('bootStrap result' + result);
    // const account_User = await bootStrap();
    //changed from result boolean
    if (result) {
      // console.log('Database bootstrapped');
      // Start the Express app after the database is bootstrapped
      /* app.listen(listen_Port, () =>
        console.log(`Listening to port ${listen_Port}`)
      );*/
      return true;
    } else {
      // console.error('Database bootstrap failed');
      return false;
    }
  } catch (error) {
    //console.error('Error during database bootstrap:', error);
    return false;
  }
}

//module.exports = bootStrap;
module.exports = intializeApp;
