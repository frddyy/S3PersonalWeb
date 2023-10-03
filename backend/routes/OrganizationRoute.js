import express from "express";
import { 
    getOrganization,
    getOrganizationByIdentityId,
    getOrganizationByOrganizationIdAndIdentityId,
    createOrganization,
    updateOrganization,
    deleteOrganization
 } from "../controllers/OrganizationController.js";

const router = express.Router();

// Route to get all organization records
router.get('/organizations', getOrganization);

router.get('/users/:userId/identities/:identityId/organizations', getOrganizationByIdentityId);

router.get('/users/:userId/identities/:identityId/organizations/:organizationId', getOrganizationByOrganizationIdAndIdentityId);

router.post('/users/:userId/identities/:identityId/organizations', createOrganization);

router.patch('/users/:userId/identities/:identityId/organizations/:organizationId', updateOrganization);

router.delete('/users/:userId/identities/:identityId/organizations/:organizationId', deleteOrganization);


export default router;
