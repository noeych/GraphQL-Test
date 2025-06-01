const mongoose = require('mongoose');

const exchageRateSchema = new mongoose.Schema({
    src: { type: String, required: true },
    tgt: { type: String, required: true },
    rate: { type: Number, required: true },
    date: { type: String, required: true }
});

// 중복 저장 방지 
exchangeRateSchema.index({ src: 1, tgt: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ExchangeRate', exchageRateSchema);