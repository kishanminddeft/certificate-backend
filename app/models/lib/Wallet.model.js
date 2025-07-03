const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils');
const enums = require('../../../enum');
const User = require('./User.model');

const Wallet = sequelize.define(
    'Wallet',
    {
        wallet_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: User, key: 'user_id' },
        },
        wallet_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        encrypted_mnemonic: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        provider_name: {
            type: DataTypes.ENUM([...enums.walletAddressProviders]),
            defaultValue: 'Tatum',
        },
    },
    { paranoid: true, tableName: 'wallets' },
);

Wallet.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Wallet, { foreignKey: 'user_id' });

module.exports = Wallet;
