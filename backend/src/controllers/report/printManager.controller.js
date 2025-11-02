const { request, response } = require('express');
const service = require('../../service/report/printManager.service.js');
const { isAdmin } = require('../../utils/access.js');

const printsGet = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const data = await service.list(req.query);
    return res.status(200).json({ msg: 'Prints fetched', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printGet = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const data = await service.get(req.params.id);
    return res.status(200).json({ msg: 'Print fetched', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printPost = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const created = await service.create(req.body);
    return res.status(201).json({ msg: 'Print created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printPut = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const updated = await service.update(req.params.id, req.body);
    return res.status(200).json({ msg: 'Print updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printDel = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const deleted = await service.remove(req.params.id);
    return res.status(200).json({ msg: 'Print deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printGenerate = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const data = await service.generate(req.params.id);
    return res.status(200).json({ msg: 'Print generated', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const printStatus = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const data = await service.status(req.params.id);
    return res.status(200).json({ msg: 'Print status', data });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = { printsGet, printGet, printPost, printPut, printDel, printGenerate, printStatus };
