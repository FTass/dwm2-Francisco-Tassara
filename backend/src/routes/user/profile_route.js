const { Router } = require('express');
const { 
    profilePost,
    profileGetById,
    profilesGet,
    profilePut,
    profileDel,
} = require('../../controllers/user/profile.controller.js')

const router = Router();

router.get("/{:id}",   profileGetById );

router.get("/",   profilesGet );

router.post("/",   profilePost);

router.put("/:id",  profilePut);

router.delete("/:id",  profileDel );


module.exports = router