const router = require('express').Router();
const controller = require('./Controller');

/* User Router */
router.get('/user/country/list', controller.getCountries);

module.exports = router;
