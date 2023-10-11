import express from "express";
import {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/EducationController.js";

const router = express.Router();

// Route to get all education records
router.get("/identities/:identityId/educations", getEducation);

router.get("/identities/:identityId/educations/:educationId", getEducationById);

router.post("/identities/:identityId/educations", createEducation);

router.patch(
  "/identities/:identityId/educations/:educationId",
  updateEducation
);

router.delete(
  "/identities/:identityId/educations/:educationId",
  deleteEducation
);

export default router;
