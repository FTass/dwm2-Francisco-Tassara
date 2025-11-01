const { request, response } = require('express');
const service = require('../../service/report/salesReport.service.js');

const reportsGet = async (req = request, res = response) => {
  try {
    const data = await service.list(req.query);
    return res.status(200).json({ msg: 'Reports fetched', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportGet = async (req = request, res = response) => {
  try {
    const data = await service.get(req.params.id);
    return res.status(200).json({ msg: 'Report fetched', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportPost = async (req = request, res = response) => {
  try {
    const created = await service.create(req.body);
    return res.status(201).json({ msg: 'Report created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportPut = async (req = request, res = response) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    return res.status(200).json({ msg: 'Report updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportDel = async (req = request, res = response) => {
  try {
    const deleted = await service.remove(req.params.id);
    return res.status(200).json({ msg: 'Report deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportPdf = async (req = request, res = response) => {
  try {
    const data = await service.pdf(req.params.id);
    return res.status(200).json({ msg: 'Report PDF', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
const reportSummary = async (req = request, res = response) => {
  try {
    const data = await service.summary(req.params.id);
    return res.status(200).json({ msg: 'Report summary', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};
module.exports = { reportsGet, reportGet, reportPost, reportPut, reportDel, reportPdf, reportSummary };
