const repo = require('../../../database/repo/report/salesReport_repo.js');

class SalesReportService {
  async create(data) {
    if (!data.fromDate || !data.toDate) { const e = new Error('Missing dates'); e.status = 400; throw e; }
    return await repo.create(data);
  }
  async list(query = {}) {
    const filter = {};
    if (query.generatedBy) filter.generatedBy = query.generatedBy;
    return await repo.findAll(filter);
  }
  async get(id) {
    const r = await repo.findById(id);
    if (!r) { const e = new Error('Report not found'); e.status = 404; throw e; }
    return r;
  }
  async update(id, data) {
    const updated = await repo.updateById(id, data);
    if (!updated) { const e = new Error('Report not found'); e.status = 404; throw e; }
    return updated;
  }
  async remove(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) { const e = new Error('Report not found'); e.status = 404; throw e; }
    return deleted;
  }
  async pdf(id) {
    const r = await this.get(id);
    return { filename: `sales-report-${id}.pdf`, url: r.filePath || null };
  }
  async summary(id) {
    const r = await this.get(id);
    return {
      fromDate: r.fromDate,
      toDate: r.toDate,
      totalOrders: r.totalOrders || 0,
      totalRevenue: r.totalRevenue || 0,
      totalProductsSold: r.totalProductsSold || 0,
      bestSellingProducts: r.bestSellingProducts || []
    };
  }
}
module.exports = new SalesReportService();
