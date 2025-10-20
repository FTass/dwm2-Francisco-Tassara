const mongoose = require('mongoose');

const salesReportSchema = mongoose.Schema({
    fromDate: {type: Date, required: true},
    toDate: {type: Date, required: true},
    totalOrders : Number,
    totalRevenue: Double,
    totalProductsSold : Number,
    bestSellingProducts : Array,
    generatedAt: Date,
    generatedBy : {type: mongoose.Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('salesReport', salesReportSchema);