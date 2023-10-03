import express from "express";
import { 
    getEducation,
    getEducationByIdentityId,
    getEducationByEducationIdAndIdentityId,
    createEducation,
    updateEducation,
    deleteEducation
 } from "../controllers/EducationController.js";

const router = express.Router();

// Route to get all education records
router.get('/educations', getEducation);

router.get('/users/:userId/identities/:identityId/educations', getEducationByIdentityId);

router.get('/users/:userId/identities/:identityId/educations/:educationId', getEducationByEducationIdAndIdentityId);

router.post('/users/:userId/identities/:identityId/educations', createEducation);

router.patch('/users/:userId/identities/:identityId/educations/:educationId', updateEducation);

router.delete('/users/:userId/identities/:identityId/educations/:educationId', deleteEducation);


export default router;