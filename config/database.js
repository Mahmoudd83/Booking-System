const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(`failed to connect to db ${err.message}`);
    });
};

module.exports = dbConnection;
