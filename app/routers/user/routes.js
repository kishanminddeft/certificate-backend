const middleware = require('../../middlewares/middleware');
const controller = require('./Controller');

const router = require('express').Router();

router.get('/user/get-students', controller.getAllUsers);
router.get('/user/get-certificate', controller.getUsersWithCertificates);

module.exports = router;
