const SalesReport = require('../../models/report/SalesReport.js');

class SalesReportRepository {
  async create(data) {
    data.generatedAt = new Date();
    return await SalesReport.create(data);
  }
  async findById(id) {
    return await SalesReport.findById(id);
  }
  async findAll(filter = {}) {
    return await SalesReport.find(filter).sort({ generatedAt: -1 });
  }
  async updateById(id, data) {
    return await SalesReport.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteById(id) {
    return await SalesReport.findByIdAndDelete(id);
  }
}
module.exports = new SalesReportRepository();
