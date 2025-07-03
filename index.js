const { sequelize } = require('./app/utils');
const router = require('./app/routers');
const { log } = require('./helpers');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./app/models');
const { sendMail } = require('./helpers/lib/nodeMailer');

// mongodb.initialize();
router.initialize();

try {
    sequelize.sync({ alter: true }).then(async (result) => {
        log.green('Database Synced!');
        // Sample user data to be inserted (added user_id field)

        // insertUsers();
        // sendMail('Aarav Patel', 'kishan.dave@minddeft.net', '20250001031');
        // insertUsers();
        // const cryptocurrencyResponse = await Cryptocurrency.create({
        //     crypto_id: helper.uuid(),
        //     crypto_name: 'Ether',
        //     crypto_symbol: 'ETH',
        //     crypto_icon:
        //         'https://upload.wikimedia.org/wikipedia/commons/d/d0/Eth-diamond-rainbow.png',
        //     crypto_block_explorer_url: 'https://etherscan.io/',
        // });

        // log.blue(cryptocurrencyResponse.toJSON());

        // const countryResponse = await Country.create({
        //     country_id: helper.uuid(),
        //     country_name: 'India',
        //     country_flag: '',
        // });

        // log.cyan({ countryResponse: countryResponse.toJSON() });

        // User.create({
        //     user_id: helper.uuid(),
        //     full_name: 'John Doe',
        //     email_address: 'john.doe@example.com',
        //     date_of_birth: new Date(),
        //     mobile_number: 1234567890,
        //     country_id: countryResponse.toJSON().country_id,
        //     account_number: 9876543210,
        //     is_account_details_verified: false,
        //     is_kyc_verrified: false,
        // })
        //     .then((response) => {
        //         log.cyan({ response: response.toJSON() });
        //     })
        //     .catch((error) => {
        //         if (error.name === 'SequelizeUniqueConstraintError') {
        //             console.error(
        //                 'Unique constraint error:',
        //                 error.errors[0].message,
        //             );
        //         } else {
        //             console.error('Error:', error);
        //         }
        //     });

        // const aUsers = await User.findAll({
        //     include: {
        //         model: Country,
        //         attributes: ['country_id', 'country_name', 'country_flag'],
        //     },
        //     attributes: {
        //         exclude: ['createdAt', 'updatedAt', 'deletedAt', 'login_token'],
        //     },
        // });
        // log.cyan(aUsers);

        // const aCountries = await Country.findAll({ include: User });
        // log.cyan(aCountries);
    });
} catch (error) {
    console.error('Error: ', error);
}
