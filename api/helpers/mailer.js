const ejs = require('ejs');
const sgMail = require('@sendgrid/mail');

const sendGridConfig = require('../../config/index').sendGridConfig;

sgMail.setApiKey(sendGridConfig.apiKey);

module.exports = async ( template, receiver, data ) => {

  if( template.templateHTML && receiver ) {

    let mailContent = await ejs.renderFile( sendGridConfig.templatesPath + template.templateHTML, data );

    if( mailContent ) {

      return sgMail.send({
        from: sendGridConfig.from,
        to: receiver,
        subject: template.title,
        html: mailContent
      })

    } else {

      throw new Error("Couldn't load mail template " + template.templateHTML )

    }

  } else {

    throw new Error('Please specify path to mail template and provide receiver')

  }


};
