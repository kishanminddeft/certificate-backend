const router = require('express').Router();
const controller = require('./Controller');

/* User Router */
router.post('/user/auth/register', controller.register);
router.post('/user/auth/login', controller.login);
// router.post('/user/auth/login/:token/validate', validator.validateRequest(validator.validateLoginUser()), controller.validateLoginUser);
// router.post('/user/login', validators.login, controller.login);
// router.post('/user/register/new', validator.registerNew, controller.registerUser);
// router.post('/user/password/reset', validators.resetPassword, controller.resetPassword);
// router.get('/user/:token/reset', controller.userPasswordResetGet);
// router.post('/user/:token/reset', validators.userPasswordRestPost, controller.userPasswordResetPost);
// router.post('/user/logout', middleware.validateUser, controller.logoutUser);

module.exports = router;
