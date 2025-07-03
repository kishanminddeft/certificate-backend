const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../../config/config');
const { User, Country } = require('../../models');
const { helper, messageHelper, log } = require('../../../helpers');
const Helper = require('../../../helpers/lib/Helper');
const AuthHelper = require('../../../helpers/lib/authHelper');

class Controller {
    /**
     * This function is used to get basic user details from the whole User data object.
     *
     * @param {Object} oUser User object to extract the data from
     * @returns {Object} Basic user details
     */
    /**
     * Register new user (Student or University)
     */
    async register(req, res) {
        try {
            const {
                sFullName,
                sEmail,
                sPassword,
                eUserType,
                sMobileNumber,
                dDateOfBirth,
            } = req.body;

            // Validate required fields
            if (!sFullName || !sEmail || !sPassword || !eUserType) {
                return res.reply(
                    messageHelper.error('All required fields must be provided'),
                    null,
                    400,
                );
            }

            // Validate user type
            if (!['student', 'university'].includes(eUserType)) {
                return res.reply(
                    messageHelper.error(
                        'Invalid user type. Must be student or university',
                    ),
                    null,
                    400,
                );
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                where: { email_address: sEmail.toLowerCase() },
            });

            if (existingUser) {
                return res.reply(
                    messageHelper.error('User with this email already exists'),
                    null,
                    409,
                );
            }

            // Hash password
            const hashedPassword = await AuthHelper.hashPassword(sPassword);

            // Generate email verification token
            const emailVerificationToken = AuthHelper.generateRandomToken();

            // Create user
            const newUser = await User.create({
                full_name: sFullName,
                email_address: sEmail.toLowerCase(),
                password: hashedPassword,
                user_type: eUserType,

                mobile_number: sMobileNumber || null,
                date_of_birth: dDateOfBirth || null,
            });

            // Generate JWT token
            const token = AuthHelper.generateToken({
                userId: newUser.user_id,
                email: newUser.email_address,
                userType: newUser.user_type,
            });

            return res.reply(
                messageHelper.successfully('User registered successfully'),
                {
                    sToken: token,
                    sEmailVerificationToken: emailVerificationToken,
                },
                201,
            );
        } catch (error) {
            console.error('Registration error:', error);
            return res.reply(
                messageHelper.error('Registration failed'),
                null,
                500,
            );
        }
    }

    /**
     * Login user
     */
    async login(req, res) {
        try {
            const { sEmail, sPassword } = req.body;

            // Validate required fields
            if (!sEmail || !sPassword) {
                return res.reply(
                    messageHelper.error('Email and password are required'),
                    null,
                    400,
                );
            }

            // Find user by email
            const user = await User.findOne({
                where: {
                    email_address: sEmail.toLowerCase(),
                    is_active: true,
                },
                include: {
                    model: Country,
                    as: 'Country',
                    attributes: [
                        'country_id',
                        'country_name',
                        'country_flag',
                        'country_code',
                    ],
                },
            });

            if (!user) {
                return res.reply(
                    messageHelper.error('Invalid email or password'),
                    null,
                    401,
                );
            }

            // Check password
            const isPasswordValid = await AuthHelper.comparePassword(
                sPassword,
                user.password,
            );

            if (!isPasswordValid) {
                return res.reply(
                    messageHelper.error('Invalid email or password'),
                    null,
                    401,
                );
            }

            // Update last login
            await user.update({ last_login: new Date() });

            // Generate JWT token
            const token = AuthHelper.generateToken({
                userId: user.user_id,
                email: user.email_address,
                userType: user.user_type,
            });

            const userData = AuthHelper.getUserBasicDetails(user.toJSON());

            return res.reply(messageHelper.successfully('Login successful'), {
                oUser: userData,
                sToken: token,
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.reply(messageHelper.error('Login failed'), null, 500);
        }
    }
}

// const controllers = {};

// //User controllers start from here
// controllers.register = async (req, res) => {
//     try {
//         const {
//             sFirstName,
//             sLastName,
//             sEmail,
//             nContactNumber,
//             sPassword,
//             sReferCode,
//             sProfilePicUrl,
//         } = req.body;

//         const existingUser = await User.findOne({
//             $or: [{ sEmail }, { nContactNumber }],
//         });
//         if (existingUser) {
//             return res.reply(messageHelper.alreadyExists('User'));
//         }
//         const existingReferral = await User.findOne({ sReferCode });

//         // console.log('existing referral ', existingReferral);
//         if (!existingReferral) {
//             return res.reply(messageHelper.invalid('Referral link'));
//         }
//         if (existingReferral.aReferrals.length >= 2) {
//             return res.reply(
//                 messageHelper.badRequest('Referral count reached limit'),
//             );
//         }
//         const hashedPassword = await bcrypt.hash(sPassword, saltRounds);
//         const nReferralCode = helper.sortid();
//         const newUser = new User({
//             oName: {
//                 sFirstName: sFirstName,
//                 sLastName: sLastName,
//             },
//             sEmail: sEmail,
//             nContactNumber: nContactNumber,
//             sHash: hashedPassword,
//             sReferCode: nReferralCode,
//             aReferrals: [],
//             sProfilePicUrl: sProfilePicUrl,
//             oReferredBy: existingReferral._id,
//         });
//         await newUser.save();
//         const token = signJWTForUser(newUser);
//         existingReferral.aReferrals.push(newUser._id);
//         await existingReferral.save();
//         return res.reply(messageHelper.successfully('User signup'), {
//             sToken: token,
//         });
//     } catch (error) {
//         return helper.catchServerError('user.register', error, res);
//     }
// };

// controllers.login = async (req, res) => {
//     try {
//         const { sEmail, sPassword } = req.body;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.reply(messageHelper.unprocessable_entity(), {
//                 errors: errors.array(),
//             });
//         }
//         if (helper.isPassword(sPassword)) {
//             return res.reply(messageHelper.invalid('Password is'));
//         }
//         const existingUser = await User.findOne({ sEmail });
//         if (!existingUser) {
//             return res.reply(messageHelper.invalid('Email or password'));
//         }
//         const isMatch = await bcrypt.compare(sPassword, existingUser.sHash);
//         if (!isMatch) {
//             return res.reply(messageHelper.invalid('Email or password'));
//         }
//         const token = signJWTForUser(existingUser);
//         existingUser.sToken = token;
//         await existingUser.save();
//         return res.reply(messageHelper.successfully('User login'), {
//             sToken: token,
//         });
//     } catch (error) {
//         return helper.catchServerError('user.login', error, res);
//     }
// };

// controllers.resetPassword = async (req, res) => {
//     try {
//         const { sEmail } = req.body;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.reply(messageHelper.unprocessableEntity(), {
//                 errors: errors.array(),
//             });
//         }
//         const user = await User.findOne({ sEmail });
//         if (!user) {
//             return res.reply(messageHelper.invalid('Email is'));
//         }
//         const token = crypto.randomBytes(20).toString('hex');
//         user.sResetPasswordToken = token;
//         user.sResetPasswordExpires = Date.now() + 3600000;
//         await user.save();
//         await nodemailer.send(
//             'forgot_password_mail.html',
//             {
//                 SITE_NAME: config.SITE_NAME,
//                 USERNAME: user.sFirstName,
//                 ACTIVELINK: `${config.WEB_URL}/reset-password/${token}`,
//             },
//             {
//                 from: config.SMTP_FROM,
//                 to: user.sEmail,
//                 subject: 'Forgot Password',
//             },
//         );
//         return res.reply(messageHelper.successfully('Email Sent'));
//     } catch (error) {
//         return helper.catchServerError('user.resetPassword', error, res);
//     }
// };

// controllers.userPasswordResetGet = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.reply(messageHelper.unprocessableEntity(), {
//                 errors: errors.array(),
//             });
//         }
//         const user = await User.findOne({
//             sResetPasswordToken: req.params.token,
//         });
//         if (!user || user.sResetPasswordExpires < Date.now()) {
//             return res.reply(messageHelper.invalid('token expire or'));
//         } else {
//             return res.reply(
//                 messageHelper.noPrefix('reset password token is valid'),
//             );
//         }
//     } catch (error) {
//         return helper.catchServerError('auth.passwordResetGet', error, res);
//     }
// };

// controllers.userPasswordResetPost = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.reply(messageHelper.unprocessableEntity(), {
//                 errors: errors.array(),
//             });
//         }
//         const user = await User.findOne({
//             sResetPasswordToken: req.params.token,
//         });
//         if (!user || user.sResetPasswordExpires < Date.now()) {
//             return res.reply(messageHelper.expired('Token'));
//         }
//         if (req.body.sConfirmPassword !== req.body.sPassword) {
//             return res.reply(messageHelper.badRequest('Password not matched'));
//         }
//         const hash = bcrypt.hashSync(req.body.sConfirmPassword, saltRounds);
//         user.sHash = hash;
//         user.sResetPasswordToken = undefined;
//         user.sResetPasswordExpires = undefined;

//         await user.save();
//         return res.reply(messageHelper.updated('Password'));
//     } catch (error) {
//         console.error(error);
//         return res.reply(messageHelper.serverError());
//     }
// };

// controllers.logoutUser = async (req, res, next) => {
//     try {
//         await User.findByIdAndUpdate(req.userId, { sToken: '' });
//         return res.reply(messageHelper.successfully('Logout'), {
//             sToken: null,
//         });
//     } catch (error) {
//         return res.reply(messageHelper.serverError());
//     }
// };

// controllers.userRegister = async (req, res) => {
//     try {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.reply(messageHelper.unprocessableEntity(), {
//                 errors: errors.array(),
//             });
//         }

//         const { sFirstName, sLastName, sEmail } = req.body;

//         const oNewUser = await User.create({
//             firstName: sFirstName,
//             lastName: sLastName,
//             email: sEmail,
//         });

//         return res.reply(
//             messageHelper.successfully('User Registered'),
//             oNewUser.toJSON(),
//         );
//     } catch (error) {
//         console.error(error);
//         return helper.catchServerError('auth.userRegister', error, res);
//     }
// };

module.exports = new Controller();
