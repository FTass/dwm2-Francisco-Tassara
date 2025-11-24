const isObjectIdEq = (a, b) => String(a) === String(b);

const isAdmin = (user) => user?.profile?.name === 'admin';

// Normalize a resource or id to a plain id value. Accepts:
// - a raw id (string/ObjectId)
// - a Mongoose document / plain object with common user refs: userId, user, owner, createdBy
const extractUserId = (resourceOrId) => {
  if (!resourceOrId) return null;
  // primitive id (string or number)
  if (typeof resourceOrId === 'string' || typeof resourceOrId === 'number') return resourceOrId;
  // If it's an object, check common fields
  const candidateKeys = ['userId', 'user', 'owner', 'createdBy', '_id'];
  for (const key of candidateKeys) {
    if (resourceOrId[key]) {
      const val = resourceOrId[key];
      if (typeof val === 'object' && val._id) return val._id;
      return val;
    }
  }
  // last resort: maybe it's a populated user-like object with _id
  if (resourceOrId._id) return resourceOrId._id;
  return null;
};

const isOwner = (resourceUserIdOrResource, user) => {
  const resourceUserId = extractUserId(resourceUserIdOrResource);
  if (!resourceUserId || !user?._id) return false;
  return isObjectIdEq(resourceUserId, user._id);
};

// Returns true when allowed, false when not (and sends 403 response).
// Controllers expect a falsy return to stop execution after calling this helper.
const ensureOwnerOrAdmin = (res, resourceUserIdOrResource, user) => {
  if (isOwner(resourceUserIdOrResource, user) || isAdmin(user)) {
    return true;
  }

  // deja un msg genérico en producción
  res.status(403).json({ msg: 'Forbidden' });
  return false;
};

module.exports = { isAdmin, isOwner, ensureOwnerOrAdmin, isObjectIdEq, extractUserId };
