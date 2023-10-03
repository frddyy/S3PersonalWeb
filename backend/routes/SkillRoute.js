import express from "express";
import { getSkill, getSkillByIdentityId, createSkill, updateSkill, deleteSkill } from "../controllers/SkillController.js";

const router = express.Router();

// Route to get all education records
router.get("/skills", getSkill);

// Route to get Skill records by user ID
router.get("/users/:userId/identities/:identityId/skills", getSkillByIdentityId);

router.post("/skill", createSkill);

router.patch("/skill/:identityId/:id", updateSkill);

router.delete("/skill/:identityId/:id", deleteSkill);

export default router;
