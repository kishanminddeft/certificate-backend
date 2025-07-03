const { messageHelper } = require('../../../helpers');
const { Cryptocurrency } = require('../../models');

class Controller {
    async getCryptocurrencies(req, res) {
        const aCryptocurrencies = await Cryptocurrency.findAll({
            where: { is_active: true },
            attributes: [
                'crypto_id',
                'crypto_name',
                'crypto_symbol',
                'crypto_icon',
            ],
        });

        return res.reply(
            messageHelper.successfully('Cryptocurrencies fetched'),
            { aCryptocurrencies },
        );
    }
}

module.exports = new Controller();
