import express from "express";
import { 
    getOrganization,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization
 } from "../controllers/OrganizationController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Route to get all organization records
router.get('/identities/:identityId/organizations',verifyUser, getOrganization);

router.get('/identities/:identityId/organizations/:organizationId', verifyUser, getOrganizationById);

router.post('/identities/:identityId/organizations', verifyUser, createOrganization);

router.patch('/identities/:identityId/organizations/:organizationId',verifyUser, updateOrganization);

router.delete('/identities/:identityId/organizations/:organizationId', verifyUser, deleteOrganization);

export default router;
