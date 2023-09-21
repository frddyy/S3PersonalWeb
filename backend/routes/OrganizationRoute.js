import express from "express";
import { 
    getOrganization,
    getOrganizationByUserId
 } from "../controllers/OrganizationController.js";

const router = express.Router();

// Route to get all education records
router.get('/organizations', getOrganization);

// Route to get Organization records by user ID
router.get('/users/:id/organizations', getOrganizationByUserId);

export default router;