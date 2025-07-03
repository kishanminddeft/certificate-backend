class MessageHelper {
    /* Private Helper Function */

    #generate(code, prefix, message) {
        return {
            code,
            message: `${prefix ? `${prefix} ${message}` : message}`,
        };
    }

    /* 2xx Success */

    created(prefix) {
        return this.#generate(200, prefix, 'Created');
    }

    updated(prefix) {
        return this.#generate(200, prefix, 'Updated');
    }

    success(prefix) {
        return this.#generate(200, prefix, 'Success');
    }

    successfully(prefix) {
        return this.#generate(200, prefix, 'Successfully');
    }

    noPrefix(prefix) {
        return this.#generate(200, prefix, '');
    }

    /* 4xx Client Errors */

    badRequest(prefix) {
        return this.#generate(400, prefix, '');
    }

    unauthorized(prefix) {
        return this.#generate(
            401,
            prefix,
            'Authentication Error, Please try logging in again',
        );
    }

    blocked(prefix) {
        return this.#generate(401, prefix, 'Blocked');
    }

    inactive(prefix) {
        return this.#generate(403, prefix, 'Inactive');
    }

    wrongCredentials(prefix) {
        return this.#generate(403, prefix, 'Invalid credentials');
    }

    wrongOtp(prefix) {
        return this.#generate(403, prefix, 'Entered OTP is invalid');
    }

    permissionDenied(prefix) {
        // eslint-disable-next-line quotes
        return this.#generate(403, prefix, "Don't have permission");
    }

    notFound(prefix) {
        return this.#generate(404, prefix, 'Not found');
    }

    alreadyExists(prefix) {
        return this.#generate(409, prefix, 'Already exists');
    }

    invalidReq(prefix) {
        return this.#generate(406, prefix, 'Invalid Request');
    }

    userDeleted(prefix) {
        return this.#generate(406, prefix, 'Deleted by admin');
    }

    userBlocked(prefix) {
        return this.#generate(406, prefix, 'Blocked by admin');
    }

    notMatched(prefix) {
        return this.#generate(406, prefix, 'Not matched');
    }

    notVerified(prefix) {
        return this.#generate(406, prefix, 'Not verified');
    }

    requiredField(prefix) {
        return this.#generate(419, prefix, 'Field required');
    }

    expired(prefix) {
        return this.#generate(417, prefix, 'Expired');
    }

    canceled(prefix) {
        return this.#generate(419, prefix, 'Canceled');
    }

    tooManyRequests(prefix) {
        return this.#generate(429, prefix, 'Too many requests');
    }

    unprocessableEntity(prefix) {
        return this.#generate(422, prefix, '');
    }

    /* 5xx Server Errors */

    serverError(prefix) {
        return this.#generate(500, prefix, 'Server error');
    }

    serverMaintenance(prefix) {
        return this.#generate(500, prefix, 'Maintenance mode is active');
    }

    error(prefix) {
        return this.#generate(500, prefix, 'Error');
    }

    deleted(prefix) {
        return this.#generate(417, prefix, 'Deleted');
    }

    invalid(prefix) {
        return this.#generate(406, prefix, 'Invalid');
    }
}

module.exports = new MessageHelper();
