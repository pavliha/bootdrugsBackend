const fs = require('fs');
const os = require('os');
const to = require('await-to-js');

const userConfig = require('../../config/index').userConfig;

module.exports = ( path ) => {

  if ( path ) {

    path = os.homedir() + userConfig.fsPrefix + path.split( '/' )[ 3 ];

  }

  return to( fs.unlink( path ) );

};
