const { Sequelize } = require('sequelize');
const config = require('../../../config/config');

const sequelize = new Sequelize(
    config.POSTGRES_DATABASE,
    config.POSTGRES_USER,
    config.POSTGRES_PASSWORD,
    {
        host: config.POSTGRES_HOST,
        port: config.POSTGRES_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
);

module.exports = sequelize;

// POSTGRES_URL =
//     'postgres://default:1W0CTAspXJQl@ep-soft-queen-a4nrba8w-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';
// POSTGRES_PRISMA_URL =
//     'postgres://default:1W0CTAspXJQl@ep-soft-queen-a4nrba8w-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15';
// POSTGRES_URL_NO_SSL =
//     'postgres://default:1W0CTAspXJQl@ep-soft-queen-a4nrba8w-pooler.us-east-1.aws.neon.tech:5432/verceldb';
// POSTGRES_URL_NON_POOLING =
//     'postgres://default:1W0CTAspXJQl@ep-soft-queen-a4nrba8w.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';
// POSTGRES_USER = 'default';
// POSTGRES_HOST = 'ep-soft-queen-a4nrba8w-pooler.us-east-1.aws.neon.tech';
// POSTGRES_PASSWORD = '1W0CTAspXJQl';
// POSTGRES_DATABASE = 'verceldb';
