import express from "express";
import {
  getSkill,
  getSkillByIdentityId,
} from "../controllers/SkillController.js";

const router = express.Router();

// Route to get all education records
router.get("/skills", getSkill);

// Route to get Skill records by user ID
router.get(
  "/users/:userId/identities/:identityId/skills",
  getSkillByIdentityId
);

export default router;
