module.exports = function requireStaff(req, res, next) {
  if (req.session?.isStaff) return next();
  return res.redirect("/admin/login");
};