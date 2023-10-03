import express from "express";
import { 
    getIdentity,
    getIdentityByUserId,
    getIdentityByIdentityIdAndUserId,
    createIdentity,
    updateIdentity,
    deleteIdentity
 } from "../controllers/IdentityController.js";

const router = express.Router();

router.get('/identities', getIdentity);

router.get('/users/:userId/identities', getIdentityByUserId);

router.get('/users/:userId/identities/:identityId', getIdentityByIdentityIdAndUserId);

router.post('/users/:userId/identities', createIdentity);

router.patch('/users/:userId/identities/:identityId', updateIdentity);

router.delete('/users/:userId/identities/:identityId', deleteIdentity);

export default router;