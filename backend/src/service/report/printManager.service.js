const repo = require('../../../database/repo/report/printManager_repo.js');

class PrintManagerService {
  async create(data) {
    if (!data.type || !['receipt','shipping','order_summary'].includes(data.type)) { const e = new Error('Invalid type'); e.status = 400; throw e; }
    if (!data.orderId || !data.printedBy) { const e = new Error('Missing refs'); e.status = 400; throw e; }
    if (!data.filePath) { const e = new Error('Missing filePath'); e.status = 400; throw e; }
    return await repo.create(data);
  }
  async list(query = {}) {
    const filter = {};
    if (query.orderId) filter.orderId = query.orderId;
    if (query.type) filter.type = query.type;
    return await repo.findAll(filter);
  }
  async get(id) {
    const item = await repo.findById(id);
    if (!item) { const e = new Error('Print job not found'); e.status = 404; throw e; }
    return item;
  }
  async update(id, data) {
    const updated = await repo.updateById(id, data);
    if (!updated) { const e = new Error('Print job not found'); e.status = 404; throw e; }
    return updated;
  }
  async remove(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) { const e = new Error('Print job not found'); e.status = 404; throw e; }
    return deleted;
  }
  async generate(id) {
    const item = await this.get(id);
    const updated = await repo.updateById(id, { filePath: item.filePath, createdAt: new Date() });
    return updated;
  }
  async status(id) {
    const item = await this.get(id);
    return { ready: Boolean(item.filePath), filePath: item.filePath };
  }
}
module.exports = new PrintManagerService();
