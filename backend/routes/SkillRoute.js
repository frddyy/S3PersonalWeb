import express from "express";
import { getSkill, getSkillById, createSkill, updateSkill, deleteSkill } from "../controllers/SkillController.js";

const router = express.Router();

// Route to get all education records
router.get("/identities/:identityId/skills", getSkill);

// Route to get Skill records by user ID
router.get("/identities/:identityId/skills/:skillId", getSkillById);

router.post("/identities/:identityId/skills", createSkill);

router.patch("/identities/:identityId/skills/:skillId", updateSkill);

router.delete("/identities/:identityId/skills/:skillId", deleteSkill);

export default router;
