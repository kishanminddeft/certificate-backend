const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils');
const enums = require('../../../enum');
const User = require('./User.model');

const VIbanAccount = sequelize.define(
    'VIbanAccount',
    {
        viban_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: User, key: 'user_id' },
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fiat_currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iban_number: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        provider_name: {
            type: DataTypes.ENUM([...enums.vIbanAccountProviders]),
            defaultValue: 'Payset',
        },
    },
    { paranoid: true, tableName: 'viban_accounts' },
);

VIbanAccount.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(VIbanAccount, { foreignKey: 'user_id' });

module.exports = VIbanAccount;
