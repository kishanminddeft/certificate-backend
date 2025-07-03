const { messageHelper } = require('../../helpers');
const AuthHelper = require('../../helpers/lib/authHelper');
const { User } = require('../models');

class Middleware {
    /**
     * Validate JWT token and extract user information
     */
    static async validateUser(req, res, next) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                return res.reply(
                    messageHelper.error('Access token is required'),
                    null,
                    401,
                );
            }

            // Verify token
            const decoded = AuthHelper.verifyToken(token);

            // Check if user exists and is active
            const user = await User.findOne({
                where: {
                    user_id: decoded.userId,
                    is_active: true,
                },
            });

            if (!user) {
                return res.reply(
                    messageHelper.error('Invalid token or user not found'),
                    null,
                    401,
                );
            }

            // Add user info to request
            req.sUserId = user.user_id;
            req.sUserEmail = user.email_address;
            req.eUserType = user.user_type;
            req.oUser = user;

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.reply(
                messageHelper.error('Invalid or expired token'),
                null,
                401,
            );
        }
    }

    /**
     * Check if user is a student
     */
    static async validateStudent(req, res, next) {
        if (req.eUserType !== 'student') {
            return res.reply(
                messageHelper.error('Access denied. Students only.'),
                null,
                403,
            );
        }
        next();
    }

    /**
     * Check if user is a university
     */
    static async validateUniversity(req, res, next) {
        if (req.eUserType !== 'university') {
            return res.reply(
                messageHelper.error('Access denied. Universities only.'),
                null,
                403,
            );
        }
        next();
    }
}

module.exports = new Middleware();
