const Admin = require('./lib/Admin');
const Country = require('./lib/Country.model');
const Cryptocurrency = require('./lib/Cryptocurrency.model');
const User = require('./lib/User.model');
const VIbanAccount = require('./lib/VIbanAccount.model');
const Wallet = require('./lib/Wallet.model');
const WalletAddress = require('./lib/WalletAddress.model');
const Transaction = require('./lib/Transaction.model');
module.exports = {
    Admin,
    User,
    Country,
    Cryptocurrency,
    Wallet,
    WalletAddress,
    VIbanAccount,
    Transaction,
};
