const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils');

const Cryptocurrency = sequelize.define(
    'Cryptocurrency',
    {
        crypto_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        crypto_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crypto_symbol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crypto_icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crypto_block_explorer_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    { tableName: 'cryptocurrencies', paranoid: true },
);

module.exports = Cryptocurrency;
