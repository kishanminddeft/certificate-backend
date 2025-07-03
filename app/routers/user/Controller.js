const { messageHelper } = require('../../../helpers');
const { User, Country, Transaction } = require('../../models');

class Controller {
    /**
     * This function is used to get basic user details from the whole User data object.
     *
     * @param {Object} oUser User object to extract the data from
     * @returns {Object} Basic user details
     */
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();

            res.json({ users: users });
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            throw error;
        }
    }
    async getUsersWithCertificates(req, res) {
        try {
            const usersWithCerts = await Transaction.findAll();

            res.json({ users: usersWithCerts });
        } catch (error) {
            console.error('❌ Error fetching users with certificates:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new Controller();
