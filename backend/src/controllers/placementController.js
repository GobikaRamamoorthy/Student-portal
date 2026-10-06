const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const placementModel = require('../models/placementModel');

/** GET /api/placements */
const list = asyncHandler(async (req, res) => {
  res.json({ success: true, placements: placementModel.all() });
});

/** GET /api/placements/:id */
const getOne = asyncHandler(async (req, res) => {
  const placement = placementModel.findById(req.params.id);
  if (!placement) throw ApiError.notFound('Placement drive not found');
  res.json({ success: true, placement });
});

module.exports = { list, getOne };
