const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    clerkUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, "O cliente é obrigatório."]
    },
    billingType: {
        type: String,
        enum: ['BOLETO', 'CREDIT_CARD', 'PIX'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);
