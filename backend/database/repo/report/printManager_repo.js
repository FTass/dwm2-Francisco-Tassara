const PrintManager = require('../../models/report/PrintManager.js');

class PrintManagerRepository {
  async create(data) {
    data.createdAt = new Date();
    return await PrintManager.create(data);
  }
  async findById(id) {
    return await PrintManager.findById(id);
  }
  async findAll(filter = {}) {
    return await PrintManager.find(filter).sort({ createdAt: -1 });
  }
  async updateById(id, data) {
    return await PrintManager.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteById(id) {
    return await PrintManager.findByIdAndDelete(id);
  }
}
module.exports = new PrintManagerRepository();
