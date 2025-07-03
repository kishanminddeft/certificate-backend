const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils/index');

const Transaction = sequelize.define(
    'Transaction',
    {
        transaction_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        transaction_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contract_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transaction_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'BULK_MINT',
            validate: {
                isIn: [['BULK_MINT', 'SINGLE_MINT', 'TRANSFER', 'APPROVE']],
            },
            comment: 'Type of blockchain transaction',
        },
        block_number: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        gas_used: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        gas_price: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transaction_fee: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        from_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        network: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'celo-alfajores',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'PENDING',
            validate: {
                isIn: [['PENDING', 'SUCCESS', 'FAILED']],
            },
            comment: 'Transaction status',
        },
        certificates_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        start_token_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        end_token_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        enrollment_ids: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        student_names: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        processed_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        confirmed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'transactions',
        paranoid: true,
        underscored: true,
        timestamps: true,
        indexes: [
            {
                fields: ['transaction_hash'],
            },
            {
                fields: ['block_number'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['transaction_type'],
            },
            {
                fields: ['contract_address'],
            },
            {
                fields: ['created_at'],
            },
        ],
    },
);

module.exports = Transaction;
