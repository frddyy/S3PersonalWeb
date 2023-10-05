import express from "express";
import { 
    getOrganization,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization
 } from "../controllers/OrganizationController.js";

const router = express.Router();

// Route to get all organization records
router.get('/identities/:identityId/organizations', getOrganization);

router.get('/identities/:identityId/organizations/:organizationId', getOrganizationById);

router.post('/identities/:identityId/organizations', createOrganization);

router.patch('/identities/:identityId/organizations/:organizationId', updateOrganization);

router.delete('/identities/:identityId/organizations/:organizationId', deleteOrganization);


export default router;
