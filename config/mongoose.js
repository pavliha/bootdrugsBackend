const mongoose = require('mongoose');
const mongoConfig = require('./index').mongoConfig;

module.exports = () => {

  mongoose.Promise = global.Promise;

  const dbURI = `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.name}`;

  if( process.env.API_ENVIRONMENT === 'test' ) {

  } else {

    mongoose.connection.on('connected', function () {
      console.log('Mongoose connection open to ' + dbURI);
    });

    mongoose.connection.on('error',function (err) {
      console.log('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose disconnected');
    });

    mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true }).catch( err => { console.error(err); process.exit(0); });

  }

  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });

};
