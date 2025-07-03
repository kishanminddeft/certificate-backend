const ethers = require('ethers');
const UNIVERSITY_CONTRACT_ABI = require('../../../helpers/lib/CertificateABI.json');
const { Transaction, User } = require('../../models');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../../utils');
const { UNIVERSITY_CONTRACT_ADDRESS } = require('../../../config/config');

class Controller {
    constructor() {
        this.bulkMint = this.bulkMint.bind(this);
        this.getUniversityContract = this.getUniversityContract.bind(this);
    }

    async getUniversityContract() {
        const CELO_TESTNET_RPC = 'https://alfajores-forno.celo-testnet.org/';

        try {
            const privateKey = process.env.PRIVATE_KEY;
            if (!privateKey) {
                throw new Error('PRIVATE_KEY environment variable is required');
            }

            // Remove '0x' prefix if present and add it back
            const cleanPrivateKey = privateKey.startsWith('0x')
                ? privateKey
                : `0x${privateKey}`;

            // Updated for ethers v6
            const provider = new ethers.JsonRpcProvider(CELO_TESTNET_RPC);
            const wallet = new ethers.Wallet(cleanPrivateKey, provider);
            const contract = new ethers.Contract(
                UNIVERSITY_CONTRACT_ADDRESS,
                UNIVERSITY_CONTRACT_ABI,
                wallet,
            );

            return { contract, wallet, provider };
        } catch (error) {
            console.error('Contract Connection Error:', error);
            throw new Error('Failed to connect to contract');
        }
    }

    async bulkMint(req, res) {
        let transactionRecord = null;

        try {
            const { students } = req.body;
            const processedBy =
                req.user?.user_id || req.body.processed_by || 'system';

            // Get contract instance
            const { contract, wallet, provider } =
                await this.getUniversityContract();

            // Check wallet balance
            const balance = await provider.getBalance(wallet.address);

            if (balance < ethers.parseEther('0.01')) {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient balance. Please ensure wallet has enough CELO for gas fees.',
                });
            }

            // Prepare data for contract call - mapping to expected structure
            const nftDataArray = students.map((student) => ({
                enrollmentId: student.enrollment_number, // Use enrollment_number from your data
                name: student.full_name, // Use full_name from your data
                age: '20', // Calculate age from date_of_birth
                cgpa: student.cgpa.toString(),
            }));

            // Estimate gas limit
            let gasLimit;
            try {
                gasLimit = await contract.bulkMint.estimateGas(nftDataArray);
                gasLimit = (gasLimit * 120n) / 100n; // Add 20% buffer using BigInt
            } catch (error) {
                console.warn(
                    'Gas estimation failed, using default limit:',
                    error.message,
                );
                gasLimit = 500000n; // Default gas limit as BigInt
            }

            // Execute bulk mint transaction
            const tx = await contract.bulkMint(nftDataArray, {
                gasLimit: gasLimit,
            });

            // Create initial transaction record
            // transactionRecord = await Transaction.create({
            //     transaction_hash: tx.hash,
            //     contract_address: await contract.getAddress(), // Updated for ethers v6
            //     transaction_type: 'BULK_MINT',
            //     block_number: 0,
            //     gas_used: 0,
            //     gas_price: tx.gasPrice?.toString() || null,
            //     from_address: wallet.address,
            //     to_address: await contract.getAddress(),
            //     network: 'celo-alfajores',
            //     status: 'PENDING',
            //     certificates_count: students.length,
            //     enrollment_ids: students.map((s) => s.enrollment_number),
            //     student_names: students.map((s) => s.full_name),
            //     processed_by: processedBy,
            //     metadata: {
            //         gasLimit: gasLimit.toString(),
            //         estimatedGas: ((gasLimit * 100n) / 120n).toString(),
            //         studentsData: nftDataWithExtraFields,
            //     },
            // });
            transactionRecord = await Transaction.create({
                transaction_hash: tx.hash, // Use the actual transaction hash
                contract_address: await contract.getAddress(),
                transaction_type: 'BULK_MINT',
                block_number: 0,
                gas_used: 0,
                gas_price: tx.gasPrice?.toString() || null,
                from_address: wallet.address,
                to_address: await contract.getAddress(),
                network: 'celo-alfajores',
                status: 'PENDING',
                certificates_count: students.length,
                enrollment_ids: students.map((s) => s.enrollment_number),
                student_names: students.map((s) => s.full_name),
                processed_by: processedBy,
                metadata: {
                    gasLimit: gasLimit.toString(),
                    estimatedGas: ((gasLimit * 100n) / 120n).toString(),
                    studentsData: students.map((student) => ({
                        ...nftDataArray.find(
                            (data) =>
                                data.enrollmentId === student.enrollment_number,
                        ),
                        course_name: student.course,
                        college_name: student.college,
                        year: student.passingYear,
                        university_name: student.university,
                        createdAt: new Date().toISOString().split('T')[0],
                    })),
                },
            });
            // Wait for transaction confirmation
            const receipt = await tx.wait();
            // Calculate transaction fee
            const transactionFee = receipt.gasUsed * (tx.gasPrice || 0n);

            // Update transaction record with confirmation details
            if (receipt.status === 1) {
                // ✅ Only mark transaction as confirmed if it succeeded
                // sendMail('Aarav Patel', 'kishan.dave@minddeft.net', '20250001031');

                await transactionRecord.update({
                    block_number: receipt.blockNumber,
                    gas_used: receipt.gasUsed.toString(),
                    transaction_fee: transactionFee.toString(),
                    status: 'SUCCESS',
                    // start_token_id: startTokenId.toString(),
                    // end_token_id: endTokenId.toString(),
                    confirmed_at: new Date(),
                    metadata: {
                        ...transactionRecord.metadata,
                        // mintedTokens: mintedTokens,
                        confirmationTime: new Date().toISOString(),
                        effectiveGasPrice:
                            receipt.effectiveGasPrice?.toString() || null,
                    },
                });

                // ✅ Update users only if transaction was successful
                await User.update(
                    { certificate_created: true },
                    {
                        where: {
                            enrollment_number: students.map(
                                (s) => s.enrollment_number,
                            ),
                        },
                    },
                );
            } else {
                // ❌ Transaction failed (reverted)
                await transactionRecord.update({
                    block_number: receipt.blockNumber,
                    gas_used: receipt.gasUsed.toString(),
                    transaction_fee: transactionFee.toString(),
                    status: 'FAILED',
                    confirmed_at: new Date(),
                    metadata: {
                        ...transactionRecord.metadata,
                        confirmationTime: new Date().toISOString(),
                        effectiveGasPrice:
                            receipt.effectiveGasPrice?.toString() || null,
                        errorDetails: {
                            reason: 'Transaction reverted',
                            status: receipt.status,
                        },
                    },
                });

                // Optionally throw to trigger error response
                throw new Error(
                    'Transaction was mined but failed (status = 0).',
                );
            }

            res.status(200).json({
                success: true,
                message: `Successfully minted ${students.length} certificates`,
                data: {
                    transactionId: transactionRecord.transaction_id,
                    transactionHash: tx.hash,
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed.toString(),
                    transactionFee:
                        ethers.formatEther(transactionFee) + ' CELO',
                    // mintedTokens: mintedTokens,
                    totalMinted: students.length,
                    contractAddress: await contract.getAddress(),
                    network: 'Celo Alfajores Testnet',
                },
            });
        } catch (error) {
            console.error('Bulk mint error:', error);

            // Update transaction record with error if it exists
            // Update transaction record with error if it exists
            if (transactionRecord) {
                // Check if transaction was mined but failed (receipt exists)
                if (error.receipt) {
                    await transactionRecord.update({
                        block_number: error.receipt.blockNumber,
                        gas_used: error.receipt.gasUsed?.toString(),
                        status: 'FAILED',
                        error_message: error.message,
                        metadata: {
                            ...transactionRecord.metadata,
                            errorDetails: {
                                code: error.code || 'UNKNOWN_ERROR',
                                reason: error.reason || error.message,
                                blockHash: error.receipt.blockHash,
                                timestamp: new Date().toISOString(),
                            },
                        },
                    });
                } else {
                    // Fallback for errors without receipt
                    await transactionRecord.update({
                        status: 'FAILED',
                        error_message: error.message,
                        metadata: {
                            ...transactionRecord.metadata,
                            errorDetails: {
                                code: error.code || 'UNKNOWN_ERROR',
                                reason:
                                    error.reason ||
                                    error.message ||
                                    'Unspecified failure',
                                timestamp: new Date().toISOString(),
                            },
                        },
                    });
                }
            }

            let errorMessage = 'Failed to mint certificates';
            if (error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient funds for gas fees';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network connection error';
            } else if (error.reason) {
                errorMessage = error.reason;
            }

            res.status(500).json({
                success: false,
                error: errorMessage,
                details: error.message,
                transactionId: transactionRecord?.transaction_id || null,
            });
        }
    }

    async getAllCertificate(req, res) {
        try {
            // Get all users with certificates created
            const users = await User.findAll({
                where: { certificate_created: true },
                raw: true,
            });

            if (!users.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No certificates found',
                });
            }

            const { Op, literal } = require('sequelize');

            // Fetch all transactions related to these users
            const enrollmentNumbers = users.map((u) => u.enrollment_number);

            const transactions = await Transaction.findAll({
                where: {
                    transaction_type: 'BULK_MINT',
                    status: 'SUCCESS',
                    [Op.and]: [
                        literal(
                            `"enrollment_ids"::text[] && ARRAY[${enrollmentNumbers.map((n) => `'${n}'`).join(',')}]`,
                        ),
                    ],
                },
                order: [['confirmed_at', 'DESC']],
                raw: true,
            });

            // Map each user to their related transaction and token ID
            const certificates = users.map((user) => {
                const matchingTx = transactions.find((tx) =>
                    (tx.enrollment_ids || []).includes(user.enrollment_number),
                );

                const token = (matchingTx?.metadata?.mintedTokens || []).find(
                    (t) => t.enrollmentId === user.enrollment_number,
                );

                return {
                    user: {
                        full_name: user.full_name,
                        enrollment_number: user.enrollment_number,
                        course_name: user.course_name,
                        college_name: user.college_name,
                        university_name: user.university_name,
                        passing_year: user.passing_year,
                        cgpa: user.cgpa,
                    },
                    certificate: {
                        transaction_hash: matchingTx?.transaction_hash || null,
                        token_id: token?.tokenId || null,
                        block_number: matchingTx?.block_number || null,
                        confirmed_at: matchingTx?.confirmed_at || null,
                        network: matchingTx?.network || null,
                    },
                };
            });

            res.status(200).json({
                success: true,
                message: 'All certificates fetched successfully',
                total: certificates.length,
                data: certificates,
            });
        } catch (error) {
            console.error('getAllCertificate error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch certificates',
                error: error.message,
            });
        }
    }

    async getCertificateByEnrollment(req, res) {
        try {
            const { enrollmentId } = req.params;
            if (!enrollmentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Enrollment ID is required.',
                });
            }

            // 1. Find the user by enrollment ID
            const user = await User.findOne({
                where: { enrollment_number: enrollmentId },
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Student not found with provided enrollment ID.',
                });
            }

            // 2. Find the transaction that contains this enrollment ID
            const transaction = await Transaction.findOne({
                where: {
                    status: 'SUCCESS',
                    [Sequelize.Op.and]: [
                        sequelize.literal(
                            `enrollment_ids::text LIKE '%"${enrollmentId}"%'`,
                        ),
                    ],
                },
                order: [['confirmed_at', 'DESC']],
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'No certificate found for the given enrollment ID.',
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user,
                    transaction,
                },
            });
        } catch (error) {
            console.error('Error fetching certificate by enrollment:', error);

            return res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

module.exports = new Controller();
