// This file will handle connection logic to the MongoDB database

const mongoose = require('mongoose');
require('dotenv/config');

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB successfully :)');
  })
  .catch((e) => {
    console.log('Error while attempting to connect to MongoDB');
    console.log(e);
  });

// To prevent deprecation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
  mongoose,
};
