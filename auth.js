const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

// import DB functions
const { getUser, updateUserData } = require('./DbOperations/DbOperations');

const authenticateUser = async (userID, password, userData) => {
  let token;
  let newLogInAttempts;
  try {
    if (userData.userID !== userID || userData.password !== password) {
      const newCount = userData.logInAttempts.count + 1;
      const newTime = Date.now();
      newLogInAttempts = { lastTime: newTime, count: newCount };
      // eslint-disable-next-line no-underscore-dangle
      updateUserData(userData._id, { logInAttempts: newLogInAttempts });
      return token;
    }
    token = await jwt.sign({ userID }, process.env.KEY, { expiresIn: '600s' });
    newLogInAttempts = { lastTime: 0, count: 0 };
    // eslint-disable-next-line no-underscore-dangle
    await updateUserData(userData._id, { logInAttempts: newLogInAttempts });
    console.log('token', token);
  } catch (err) {
    console.error('err.message:', err.message);
  }
  return token;
};

const verifyUser = async (token) => {
  try {
    // decoded
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await getUser(decoded.userID);
    if (!user) {
      return false;
    }
  } catch (err) {
    // invalid token
    console.error(err.message);
    return false;
  }
  return true;
};

module.exports = { authenticateUser, verifyUser };
