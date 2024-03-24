const mongoose = require('mongoose');

const paymentReportsSchema = new mongoose.Schema({
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
    paymentLink: String,
    value: {
        type: Number,
        required: true
    },
    netValue: {
        type: Number,
        required: true
    },
    originalValue: Number,
    interestValue: Number,
    description: {
        type: String,
        required: true
    },
    billingType: {
        type: String,
        required: true
    },
    canBePaidAfterDueDate: {
        type: Boolean,
        required: true
    },
    pixTransaction: String,
    status: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    originalDueDate: {
        type: Date,
        required: true
    },
    paymentDate: Date,
    clientPaymentDate: Date,
    installmentNumber: Number,
    invoiceUrl: String,
    invoiceNumber: String,
    externalReference: String,
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
    creditDate: Date,
    estimatedCreditDate: Date,
    transactionReceiptUrl: String,
    nossoNumero: String,
    bankSlipUrl: String,
    lastInvoiceViewedDate: Date,
    lastBankSlipViewedDate: Date,
    discount: {
        value: {
            type: Number,
            default: 0
        },
        limitDate: Date,
        dueDateLimitDays: Number,
        type: {
            type: String,
            default: 'PERCENTAGE'
        }
    },
    fine: {
        value: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            default: 'PERCENTAGE'
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
    postalService: {
        type: Boolean,
        default: false
    },
    custody: String,
    refunds: Array
});

const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;
