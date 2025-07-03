const router = require('express').Router();
const controller = require('./Controller');

/* User Router */
router.post('/user/bulk-certificate', controller.bulkMint);
router.get('/user/get-all-certificate', controller.getAllCertificate);
router.get(
    '/user/get-certificate/:enrollmentId',
    controller.getCertificateByEnrollment,
);

module.exports = router;
