const { Router } = require('express');
const { 
    profilePost,
    profileGetById,
    profilesGet,
    profilePut,
    profileDel,
} = require('../../controllers/user/profile.controller.js')


const requireAuth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/authorize');



const router = Router();

router.use(requireAuth, requireRole('admin')); 
router.get("/",   profilesGet );

router.get("/{:id}",   profileGetById );

router.post("",   profilePost);

router.put("/:id",  profilePut);

router.delete("/:id",  profileDel );


module.exports = router