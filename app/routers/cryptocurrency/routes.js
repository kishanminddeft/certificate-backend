const controller = require('./Controller');

const router = require('express').Router();

router.get('/user/cryptocurrency/list', controller.getCryptocurrencies);

module.exports = router;
