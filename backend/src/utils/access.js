const isObjectIdEq = (a, b) => String(a) === String(b);

const isAdmin = (user) => user?.profile?.name === 'admin';

const isOwner = (resourceUserId, user) => {
  if (!resourceUserId || !user?._id) return false;
  return isObjectIdEq(resourceUserId, user._id);
};

const ensureOwnerOrAdmin = (res, resourceUserId, user) => {
  if (isOwner(resourceUserId, user) || isAdmin(user)) return true;
  res.status(403).json({ msg: 'Forbidden' });
  return false;
};

module.exports = { isAdmin, isOwner, ensureOwnerOrAdmin, isObjectIdEq };
