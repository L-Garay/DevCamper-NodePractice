const Bootcamp = require('../models/Bootcamp');

// GET all bootcamps FROM /api/v1/bootcamps PUBLIC
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// GET single bootcamp FROM /api/v1/bootcamps/:id PUBLIC
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: 'Cannot find bootcamp by that id' });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// POST new bootcamp FROM /api/v1/bootcamps PRIVATE
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// PUT edit a bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: 'Cannot find bootcamp by that id' });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// DELETE single bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: 'Cannot find bootcamp by that id' });
    }
    res
      .status(200)
      .json({ success: true, msg: 'Successfully deleted bootcamp' });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
