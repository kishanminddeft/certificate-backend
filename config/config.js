require('dotenv').config();

const config = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: process.env.PORT || 4000,

    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_HOST: process.env.POSTGRES_HOST || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || '',
    POSTGRES_PORT: process.env.POSTGRES_PORT,

    JWT_VALIDITY: process.env.JWT_VALIDITY || '1d', // 1 day
    JWT_SECRET: process.env.JWT_SECRET || 'cH@!nu5_sec',
    LOGIN_EXPIRY: process.env.LOGIN_EXPIRY || '15m', // 15 minutes

    MAIL_TRANSPORTER: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 465,
        auth: {
            user: process.env.SMTP_USERNAME || 'example@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'example@123',
        },
        secure: true,
    },
    SMTP_FROM: process.env.SMTP_FROM || 'example@gmail.com',
    WEB_URL: process.env.WEB_URL || 'http://localhost:5000',
    SITE_NAME: process.env.SITE_NAME || 'Demo',

    BASE_URL: process.env.BASE_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    UNIVERSITY_CONTRACT_ADDRESS: process.env.UNIVERSITY_CONTRACT_ADDRESS,
};

console.warn(config.NODE_ENV);

module.exports = config;
