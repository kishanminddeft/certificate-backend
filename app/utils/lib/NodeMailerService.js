const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const config = require('../../../config/config');

const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER);

class NodeMailerService {
    send(templateName, data, mailOption) {
        const emailTemplatePath = path.join(
            __dirname,
            'dir',
            'email_templates',
        );
        const template = fs.readFileSync(
            emailTemplatePath + '/' + templateName,
            {
                encoding: 'utf-8',
            },
        );
        const emailBody = ejs.render(template, data);
        mailOption.html = emailBody;
        return transporter.sendMail(mailOption);
    }

    sendMail(mailOption) {
        return transporter.sendMail(mailOption);
    }
}

// const services = {};

// services.send = function (templateName, data, mailOption) {
//     const emailTemplatePath = path.join(__dirname, 'dir', 'email_templates');
//     const template = fs.readFileSync(emailTemplatePath + '/' + templateName, {
//         encoding: 'utf-8',
//     });
//     const emailBody = ejs.render(template, data);
//     mailOption.html = emailBody;
//     return transporter.sendMail(mailOption);
// };

// services.sendMail = function (mailOption) {
//     return transporter.sendMail(mailOption);
// };

module.exports = new NodeMailerService();
