const path = require('path');

module.exports =  {
  serverConfig: {
    scheme: process.env.HTTP_SERVER_SCHEME || 'http',
    host: process.env.HTTP_SERVER_HOST || 'localhost',
    port: process.env.HTTP_SERVER_PORT || 8172,
    paths: {
      resetPasswordRequest: 'reset-password'
    },
    dailyLifeTime: 86400, // 1 day,
    tokenLifeTime: 15770000, // aprox ~6 month
    baseAuthOptions: (req) => ({ hash: req.get( 'authorization' ).replace( 'Bearer ', '' ) }),
    additionalAuthOptions: (req) => ({ // use additional auth options while searching tokens
      //userAgent: req.headers[ 'user-agent' ],
      //userIp: req.connection.remoteAddress
    }),
    passwordSaltRound : process.env.SALT_ROUNDS || 10,
  },
  mongoConfig: {
    host: process.env.MONGO_DB_HOST || 'localhost',
    port: process.env.MONGO_DB_PORT || 27017,
    name: process.env.MONGO_DB_NAME || 'based'
  },
  userConfig: {
    roles: {
      admin: 0,
      default: 1
    }
  },
  uploadsConfig: {
    httpPrefix: '/api/images/',
    fsPrefix: '/public/',
    acceptedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ],
    fileTypeError: "Unsupported file type",
    fileFieldError: "Incorrect field name in FormData",
    validFiledNames: [
      'avatar'
    ]
  },
  sendGridConfig: {
    apiKey: process.env.SEND_GRID_API_KEY,
    from: 'team@powercode.us',
    templatesPath: path.join(__dirname, '/../api/mailTemplates/'),
    templates: {
      passwordReset: {
        title: "Password Reset",
        templateHTML: 'passwordReset.html'
      },
      accountEmailVerify: {
        title: "Verify Account",
        templateHTML: 'verifyEmail.html'
      }
    }
  }
};
