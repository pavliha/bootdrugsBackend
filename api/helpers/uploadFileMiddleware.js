const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp');
const md5 = require('md5');
const Busboy = require('busboy');

const uploadsConfig = require('../../config/index').uploadsConfig;

module.exports = ( req, res, next ) => {

  let busboy;

  try {

    busboy = new Busboy( { headers: req.headers } );

    if ( !busboy ) throw new Error('File Upload fails: incorrect headers sent')

  } catch ( e ) {
    e.statusCode = 404;
    next(e)
  }

  busboy.on( 'file', async ( fieldname, file, filename, encoding, mimetype ) => {

    if (  fieldname && uploadsConfig.acceptedMimeTypes.indexOf( mimetype ) >= 0 ) {

      let name = md5( Date.now() );

      name += '.' + mimetype.split( '/' )[ 1 ];

      let path = os.homedir() + uploadsConfig.fsPrefix + fieldname + '/' + name;

      req.files = req.files || {};

      req.files[ fieldname ] = uploadsConfig.httpPrefix + name;

      mkdirp( os.homedir() + uploadsConfig.fsPrefix + fieldname, function ( err ) {
        if(err) console.log('File dir error: ', err );
        file.pipe( fs.createWriteStream( path ) );
      });

    } else {
      next( `${uploadsConfig.fileTypeError} : ${mimetype}`);
    }

  });

  busboy.on( 'finish', function () {
    next();
  });

  return req.pipe( busboy );

};
