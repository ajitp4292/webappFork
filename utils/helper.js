const bcrypt = require('bcrypt');
////RECENT CHANGE Oct1 START
//const userModel = require('../Models/user-model');//EARLIER
const { Account } = require('../Models/association');

/////RECENT CHANGE Oct1 END

//Hashing Logic for Users password
const createPassHash = async (pass) => {
  const salt = await bcrypt.genSalt();
  const hashedpassword = await bcrypt.hash(pass, salt);
  return hashedpassword;
};

const getDecryptedCreds = (authHeader) => {
  const base64Creds = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Creds, 'base64').toString('ascii');

  const userName = credentials.split(':')[0];
  const pass = credentials.split(':')[1];

  return { userName, pass };
};

//To be Implemented
/*
const uAuthCheck = async (req, res, next) => {
  //Check if auth header is present and is a basic auth header.
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') === -1
  ) {
    logger.error('Authorization header missing - Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  //decode the auth header
  let { userName, pass } = getDecryptedCreds(req.headers.authorization);
  const id = req?.params?.id;

  //Check if user is valid
  let userAccCheck = await validUser(userName, pass);

  if (!userName || !pass || !userAccCheck) {
    logger.error('Incorrect user details - Unauthorized');
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  //Check if user creds match the user at id.
  let dbCheck = await dbCredVal(userName, pass, id);
  if (dbCheck) {
    logger.error(`Incorrect user details - ${dbCheck}`);
    return res.status(dbCheck == 'Forbidden' ? 403 : 404).json({
      message: dbCheck,
    });
  }

  next();
};
*/

const aAuthCheck = async (req, res, next) => {
  //Check if auth header is present and is a basic auth header.

  console.log('Inside MiddleWare aAuthCheck');
  const authHeader = req.headers.authorization;
  ///MAIN CODE START
  console.log('Authorization Header' + ' ' + authHeader);
  //console.log('Auth' + req.headers.authorization.indexOf('Basic'));
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      message: 'Bad Request: Missing or invalid Authorization header',
    });
  }
  /*if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') !== 0
  ) {
    //logger.error("Authorization header missing - Unauthorized");
    console.log('Authorization header missing - Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }
*/

  //decode the auth header
  let { userName, pass } = getDecryptedCreds(req.headers.authorization);
  console.log('Expected email as UserName' + userName);
  console.log('Password' + pass);
  if (!userName || !pass) {
    return res
      .status(401)
      .json({ message: 'Bad Request: Missing username or password' });
  }

  //const id = req?.params?.id;

  //Check if user is valid
  let userAccCheck = await validUser(userName, pass);

  if (!userAccCheck) {
    //logger.error('Incorrect user details - Unauthorized');
    return res.status(401).json({
      message: 'Unauthorized User',
    });
  }

  ///MAIN CODE END

  /*if (id) {
    //Check if user creds match the product at id.
    let dbCheck = await dbProdVal(userName, pass, id);
    if (dbCheck) {
      logger.error(`Incorrect user details - ${dbCheck}`);
      return res.status(dbCheck == 'Forbidden' ? 403 : 404).json({
        message: dbCheck,
      });
    }
  }*/
  //Removing temporary
  next();
};

const validUser = async (userName, pass) => {
  let result = await Account.findOne({
    where: { email: userName },
    attributes: ['password'],
  });
  if (!result?.dataValues?.password) {
    return false;
  }

  let passCheck = await bcrypt.compare(pass, result.dataValues.password);
  console.log(passCheck);
  if (!passCheck) {
    return false;
  }

  return true;
};

const validUserId = async (userName) => {
  //RECENT CHNAGE OCT 2
  let result = await Account.findOne({
    where: { email: userName },
    attributes: ['id'],
  });

  return result.id;
};

const userIdExits = async (emailIdvalue) => {
  const countRows = await Account.count({
    where: { email: emailIdvalue },
  });
  return countRows;
};

const invalidPath = (req, res) => {
  return res.status(404).json({
    message: 'Resource Not Found',
  });
};

const methodNotAllowed = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  //console.log('Inside all for /healthz');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');
  res.status(405).end();
};
const isUUIDv4 = (input) => {
  const uuidv4Pattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidv4Pattern.test(input);
};

const isValidISODATE = (dateString) => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateString);
};

const checkQueryParams = (req, res, next) => {
  const queryString = req.originalUrl.split('?')[1]; // Get the query string

  // Check if there are any query parameters after /assignments
  if (queryString) {
    return res.status(400).json({
      message: 'Bad request - Query parameters not allowed after /assignments',
    });
  }

  // If no query parameters, continue to the next middleware or route handler
  next();
};

module.exports = {
  createPassHash,
  getDecryptedCreds,
  aAuthCheck,
  validUserId,
  userIdExits,
  invalidPath,
  isUUIDv4,
  methodNotAllowed,
  isValidISODATE,
  checkQueryParams,
};
