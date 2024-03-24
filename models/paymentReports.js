const mongoose = require('mongoose');

const paymentReportsSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    payment: {
        object: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        dateCreated: {
            type: Date,
            required: true
        },
        customer: {
            type: String,
            required: true
        },
        subscription: {
            type: String
        },
        installment: {
            type: String
        },
        paymentLink: {
            type: String
        },
        dueDate: {
            type: Date,
            required: true
        },
        originalDueDate: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        netValue: {
            type: Number,
            required: true
        },
        originalValue: {
            type: Number
        },
        interestValue: {
            type: Number
        },
        nossoNumero: {
            type: String
        },
        description: {
            type: String,
            required: true
        },
        externalReference: {
            type: String,
            required: true
        },
        billingType: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        pixTransaction: {
            type: String
        },
        confirmedDate: {
            type: Date,
            required: true
        },
        paymentDate: {
            type: Date,
            required: true
        },
        clientPaymentDate: {
            type: Date,
            required: true
        },
        installmentNumber: {
            type: Number
        },
        creditDate: {
            type: Date,
            required: true
        },
        custody: {
            type: String
        },
        estimatedCreditDate: {
            type: Date,
            required: true
        },
        invoiceUrl: {
            type: String
        },
        bankSlipUrl: {
            type: String
        },
        transactionReceiptUrl: {
            type: String
        },
        invoiceNumber: {
            type: String,
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        anticipated: {
            type: Boolean,
            default: false
        },
        anticipable: {
            type: Boolean,
            default: false
        },
        lastInvoiceViewedDate: {
            type: Date
        },
        lastBankSlipViewedDate: {
            type: Date
        },
        postalService: {
            type: Boolean,
            default: false
        },
        creditCard: {
            creditCardNumber: {
                type: String
            },
            creditCardBrand: {
                type: String
            },
            creditCardToken: {
                type: String
            }
        },
        discount: {
            value: {
                type: Number,
                default: 0
            },
            dueDateLimitDays: {
                type: Number,
                default: 0
            },
            limitedDate: {
                type: Date
            },
            type: {
                type: String,
                default: 'FIXED'
            }
        },
        fine: {
            value: {
                type: Number,
                default: 0
            },
            type: {
                type: String,
                default: 'FIXED'
            }
        },
        interest: {
            value: {
                type: Number,
                default: 0
            },
            type: {
                type: String,
                default: 'PERCENTAGE'
            }
        },
        split: [
            {
                walletId: {
                    type: String,
                    required: true
                },
                fixedValue: {
                    type: Number
                },
                percentualValue: {
                    type: Number
                },
                status: {
                    type: String,
                    required: true
                },
                refusalReason: {
                    type: String
                }
            }
        ],
        chargeback: {
            status: {
                type: String,
                required: true
            },
            reason: {
                type: String,
                required: true
            }
        },
        refunds: [
            {
                // Definir o esquema de reembolso, se aplicável
            }
        ]
    }
});

const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;
