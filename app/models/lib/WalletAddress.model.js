const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils');
const Wallet = require('./Wallet.model');
const Cryptocurrency = require('./Cryptocurrency.model');

const WalletAddress = sequelize.define(
    'WalletAddress',
    {
        address_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        wallet_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: Wallet, key: 'wallet_id' },
        },
        crypto_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: Cryptocurrency, key: 'crypto_id' },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    { paranoid: true, tableName: 'wallet_addresses' },
);

// Wallet to Wallet Address Relationship
WalletAddress.belongsTo(Wallet, { foreignKey: 'wallet_id' });
Wallet.hasMany(WalletAddress, { foreignKey: 'wallet_id' });

// Cryptocurrency to Wallet Address Relationship
WalletAddress.belongsTo(Cryptocurrency, { foreignKey: 'crypto_id' });
Cryptocurrency.hasMany(WalletAddress, { foreignKey: 'crypto_id' });

module.exports = WalletAddress;
