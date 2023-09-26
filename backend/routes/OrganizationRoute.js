import express from "express";
import {
  getOrganization,
  getOrganizationByIdentityId,
} from "../controllers/OrganizationController.js";

const router = express.Router();

// Route to get all education records
router.get("/organizations", getOrganization);

// Route to get Organization records by user ID
router.get(
  "/users/:userId/identities/:identityId/organizations",
  getOrganizationByIdentityId
);

export default router;
