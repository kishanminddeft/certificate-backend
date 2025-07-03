const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v7: uuidv7 } = require('uuid');

const messageHelper = require('./MessageHelper');
const config = require('../../config/config');

class Helper {
    catchServerError(name, error, res) {
        console.error(name, error);
        // if (process.env.NODE_ENV !== 'dev') // Log error to the monitoring tool
        return res.reply(messageHelper.serverError());
    }

    encryptPassword(password) {
        return crypto
            .createHmac('sha256', config.JWT_SECRET)
            .update(password)
            .digest('hex');
    }

    uuid() {
        return uuidv7();
    }

    clone(data = {}) {
        const originalData = data.toObject ? data.toObject() : data; // for mongodb result operations
        const eType = originalData ? originalData.constructor : 'normal';

        if (eType === Object) return { ...originalData };
        if (eType === Array) return [...originalData];

        return data;
    }

    encodeToken(body, expTime) {
        try {
            /* eslint-disable indent */
            return expTime
                ? jwt.sign(this.clone(body), config.JWT_SECRET, {
                      expiresIn: expTime,
                  })
                : jwt.sign(this.clone(body), config.JWT_SECRET);
            /* eslint-enable indent */
        } catch {
            return undefined;
        }
    }

    decodeToken(token) {
        try {
            return jwt.decode(token, config.JWT_SECRET);
        } catch {
            return undefined;
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.JWT_SECRET);
        } catch (error) {
            return error ? error.message : error;
        }
    }

    delay(ttl) {
        return new Promise((resolve) => setTimeout(resolve, ttl));
    }
}

module.exports = new Helper();
