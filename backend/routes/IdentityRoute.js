import express from "express";
import { 
    getIdentity,
    getIdentityById,
    createIdentity,
    updateIdentity,
    deleteIdentity
 } from "../controllers/IdentityController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/identities', verifyUser, getIdentity);
router.get('/identities/:id', verifyUser, getIdentityById);
router.post('/identities', verifyUser, createIdentity);
router.patch('/identities/:id', verifyUser, updateIdentity);
router.delete('/identities/:id', verifyUser, deleteIdentity);

export default router;