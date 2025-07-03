const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils');

const Country = sequelize.define(
    'Country',
    {
        country_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        country_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country_flag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    { tableName: 'countries', paranoid: true },
);

module.exports = Country;
