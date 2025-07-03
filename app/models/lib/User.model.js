const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils/index');

const User = sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        enrollment_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        college_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        university_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passing_year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mobile_number: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        cgpa: {
            type: DataTypes.DECIMAL(4, 2), // Allows values like 9.85, 10.00
            allowNull: true, // Allow null for existing records
            validate: {
                min: 0.0,
                max: 10.0,
                isDecimal: true,
            },
            comment: 'Cumulative Grade Point Average (0.00 to 10.00)',
        },
        login_token: DataTypes.STRING,
        // Explicitly define timestamp fields with defaults
        certificate_created: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Indicates if certificate is created (true or false)',
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        paranoid: true,
        underscored: true,
        timestamps: false, // Disable automatic timestamps since we defined them manually
    },
);

module.exports = User;
