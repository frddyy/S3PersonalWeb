import express from "express";
import { 
    getSkill,
    getSkillByUserId
 } from "../controllers/SkillController.js";

const router = express.Router();

// Route to get all education records
router.get('/skills', getSkill);

// Route to get Skill records by user ID
router.get('/users/:id/skills', getSkillByUserId);

export default router;