const router = require('express').Router();

const authRoutes = require('./auth/routes');
const countryRoutes = require('./country/routes');
const cryptocurrencyRoutes = require('./cryptocurrency/routes');
const userRoutes = require('./user/routes');
const certificateRoutes = require('./certificate/router');

router.use([
    authRoutes,
    countryRoutes,
    cryptocurrencyRoutes,
    userRoutes,
    certificateRoutes,
]);

module.exports = router;
