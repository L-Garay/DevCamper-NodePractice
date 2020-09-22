// GET all bootcamps FROM /api/v1/bootcamps PUBLIC
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};
// GET single bootcamp FROM /api/v1/bootcamps/:id PUBLIC
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show single bootcamp ${req.params.id}` });
};
// POST new bootcamp FROM /api/v1/bootcamps PRIVATE
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create a bootcamp' });
};
// PUT edit a bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Edit a bootcamp ${req.params.id}` });
};
// DELETE single bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete a bootcamp ${req.params.id}` });
};
