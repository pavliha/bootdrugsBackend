
const responseErrors = require('../../config/responseMessages').error;

class BaseController {
  constructor() {
    this.context = this;
  }

  get try () {
    return new Proxy( this.context, {
      // Intercept method getter
      get(target, name) {
        if (typeof target[name] === 'function') {
          return async function () {
            const [ req, res, next ] = arguments; // get next function
            try {
              return await target[name].apply(target, arguments)
            } catch (e) {
              next(e)
            }
          }
        }
        return target[name];
      }
    });
  }

  responseJSON ( code, res, data) {
    return res.status(code).json( data )
  }

  responseUnauthorized ( res ) {
    return res.status(401).json({ error: { message: responseErrors.unauthorized } })
  }

  responseForbidden ( res ) {
    return res.status(403).json({ error: { message: responseErrors.forbidden }})
  }

  responseDuplicate ( res ) {
    return res.status(409).json({ error: { message: responseErrors.duplicatedResource }})
  }

}

module.exports = BaseController;
