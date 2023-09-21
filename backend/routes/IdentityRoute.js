import express from "express";
import { 
    getIdentity,
    getIdentityByUserId
 } from "../controllers/IdentityController.js";

const router = express.Router();

// Route to get all education records
router.get('/identities', getIdentity);

// Route to get education records by user ID
router.get('/users/:id/identities', getIdentityByUserId);

export default router;