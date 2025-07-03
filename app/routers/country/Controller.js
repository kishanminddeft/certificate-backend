const { messageHelper } = require('../../../helpers');
const { Country } = require('../../models');

class Controller {
    async getCountries(req, res) {
        const aCountries = await Country.findAll({
            where: { is_active: true },
            attributes: ['country_id', 'country_name', 'country_flag'],
        });

        return res.reply(messageHelper.successfully('Countries fetched'), {
            aCountries,
        });
    }
}

module.exports = new Controller();
