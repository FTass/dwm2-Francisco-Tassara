module.exports = function requireRole(roleName) {
  return (req, res, next) => {
    const profName = req?.user?.profile?.name;
    if (profName !== roleName) return res.status(403).json({ msg: 'Forbidden' });
    next();
  };
};
