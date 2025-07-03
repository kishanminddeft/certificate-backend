// helpers/authHelper.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthHelper {
    /**
     * Hash password
     */
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Compare password
     */
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Generate JWT token
     */
    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
    }

    /**
     * Verify JWT token
     */
    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    /**
     * Generate random token
     */
    static generateRandomToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Get user basic details
     */
    static getUserBasicDetails(oUser) {
        return {
            sUserId: oUser.user_id,
            sFullName: oUser.full_name,
            sEmail: oUser.email_address,
            eUserType: oUser.user_type,
            dDob: oUser.date_of_birth,
            nMobileNumber: oUser.mobile_number,
            nAccountNumber: oUser.account_number,
            eKycVerificationStatus: oUser.kyc_verification_status,
            eAccountVerificationStatus:
                oUser.account_details_verification_status,
            bEmailVerified: oUser.email_verified,
            bIsActive: oUser.is_active,
            dLastLogin: oUser.last_login,
            oCountry: oUser.Country
                ? {
                      sCountryId: oUser.Country.country_id,
                      sCountryName: oUser.Country.country_name,
                      sCountryFlag: oUser.Country.country_flag,
                      sCountryCode: oUser.Country.country_code,
                  }
                : null,
        };
    }
}

module.exports = AuthHelper;
