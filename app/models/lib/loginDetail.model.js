const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils/index');
const enums = require('../../../enum'); // Make sure this has a `userType` enum: ['STUDENT', 'UNIVERSITY']

const LoginDetail = sequelize.define(
    'LoginDetail',
    {
        login_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_type: {
            type: DataTypes.ENUM(...enums.userType), // ['STUDENT', 'UNIVERSITY']
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        last_login_at: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'login_details',
        paranoid: true, // Enables soft deletes
    },
);

module.exports = LoginDetail;
