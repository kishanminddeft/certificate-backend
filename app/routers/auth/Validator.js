const { body, param, validationResult } = require('express-validator');
const { User, Country } = require('../../models');
const { messageHelper } = require('../../../helpers');

class Validator {
    validateRequest(validations) {
        return async (req, res, next) => {
            for (const validation of validations) {
                await validation.run(req);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.reply(messageHelper.unprocessableEntity(), {
                    errors: errors.array(),
                });
            }

            next();
        };
    }

    adminLogin() {
        return [
            body('sEmail').not().isEmpty().bail().isEmail(),
            body('sPassword').not().isEmpty(),
        ];
    }

    passwordResetPost() {
        return [
            body('sPassword')
                .not()
                .isEmpty()
                .bail()
                .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/,
                ),
            body('sConfirmPassword')
                .not()
                .isEmpty()
                .bail()
                .custom((value, { req }) => {
                    return value === req.body.sPassword;
                }),
            param('token').not().isEmpty(),
        ];
    }

    registerUser() {
        return [
            body('sFullName')
                .trim()
                .notEmpty()
                .withMessage('Full name is required'),
            body('sEmail')
                .trim()
                .notEmpty()
                .withMessage('Email ID is required')
                .bail()
                .isEmail()
                .withMessage('Invalid email ID')
                .bail()
                .custom(async (value) => {
                    const nUser = await User.count({
                        where: { email_address: value },
                    });

                    if (nUser > 0) {
                        throw new Error(
                            'User with the given email ID already exists',
                        );
                    }

                    return true;
                }),
            body('sCountryId')
                .notEmpty()
                .withMessage('Country is required')
                .bail()
                .isUUID('7')
                .withMessage('Invalid country ID')
                .bail()
                .custom(async (value) => {
                    const nCountry = await Country.count({
                        where: { country_id: value },
                    });

                    if (nCountry === 0) throw new Error('Invalid country ID');

                    return true;
                }),
            body('dDob')
                .notEmpty()
                .withMessage('Date of birth is required')
                .bail()
                .matches(/^\d{4}-\d{2}-\d{2}$/)
                .withMessage('Date of birth must be in the format YYYY-MM-DD')
                .bail()
                .custom((value) => {
                    const dDob = new Date(value);

                    // Check if the date is valid
                    if (isNaN(dDob.getTime()))
                        throw new Error('Invalid date of birth');

                    // Check if the user is at least 18 years old
                    const dToday = new Date();
                    const nAge = dToday.getFullYear() - dDob.getFullYear();
                    const nMonthDifference =
                        dToday.getMonth() - dDob.getMonth();
                    const nDayDifference = dToday.getDate() - dDob.getDate();

                    if (
                        nAge < 18 ||
                        (nAge === 18 &&
                            (nMonthDifference < 0 ||
                                (nMonthDifference === 0 && nDayDifference < 0)))
                    ) {
                        throw new Error('User must be at least 18 years old');
                    }

                    return true;
                }),
            body('nAccountNumber')
                .notEmpty()
                .withMessage('Account Number is required')
                .bail()
                .isNumeric()
                .withMessage('Invalid account number')
                .bail()
                .custom(async (value) => {
                    const nUser = await User.count({
                        where: { account_number: value },
                    });

                    if (nUser > 0) {
                        throw new Error(
                            'This account number is associated with a different account',
                        );
                    }

                    return true;
                }),
            body('nMobileNumber')
                .notEmpty()
                .withMessage('Mobile Number is required')
                .bail()
                .isMobilePhone()
                .withMessage('Invalid mobile number')
                .bail()
                .custom(async (value) => {
                    const nUser = await User.count({
                        where: { mobile_number: value },
                    });

                    if (nUser > 0) {
                        throw new Error(
                            'This mobile number is associated with a different account',
                        );
                    }

                    return true;
                }),
        ];
    }

    requestLoginUser() {
        return [
            body('sEmail')
                .trim()
                .notEmpty()
                .withMessage('Email ID is required')
                .bail()
                .isEmail()
                .withMessage('Invalid email ID')
                .bail()
                .custom(async (value, { req }) => {
                    const oUser = await User.findOne({
                        where: { email_address: value },
                        attributes: ['user_id'],
                    });

                    if (!oUser) {
                        throw new Error(
                            'User with the given email ID does not exist',
                        );
                    }

                    req.sUserId = oUser.user_id;

                    return true;
                }),
        ];
    }

    validateLoginUser() {
        return [
            param('token')
                .trim()
                .notEmpty()
                .withMessage('Invalid login token')
                .bail()
                .isJWT()
                .withMessage('Invalid login token'),
        ];
    }

    login() {
        return [
            body('sEmail').not().isEmpty().bail().isEmail(),
            body('sPassword').not().isEmpty(),
        ];
    }

    resetPassword() {
        return [body('sEmail').not().isEmpty().bail().isEmail()];
    }

    userPasswordResetPost() {
        return [
            param('token').not().isEmpty(),
            body('sPassword').not().isEmpty(),
            body('sConfirmPassword').not().isEmpty(),
        ];
    }

    registerNew() {
        return [
            body('sFirstName')
                .notEmpty()
                .withMessage('First Name is Required.'),
            body('sLastName').notEmpty().withMessage('Last Name is Required.'),
            body('sEmail')
                .notEmpty()
                .withMessage('Email is required.')
                .bail()
                .isEmail()
                .withMessage('Invalid Email.')
                .bail()
                .custom(async (value) => {
                    const user = await User.findOne({
                        where: { email: value },
                    });

                    if (user) {
                        throw new Error(
                            'User with given email already exists.',
                        );
                    }

                    return true;
                }),
        ];
    }
}

module.exports = new Validator();
