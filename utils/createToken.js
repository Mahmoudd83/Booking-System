const JWT = require("jsonwebtoken");

const createtoken = (paylod) => 
  JWT.sign({ userId: paylod }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
;

module.exports = createtoken;
