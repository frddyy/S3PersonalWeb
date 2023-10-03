import express from "express";
import { 
    getSocialMedia,
    getSocialByIdentityId
 } from "../controllers/SocialMediaController.js";

const router = express.Router();

// Route to get all education records
router.get('/social_media', getSocialMedia);

// Route to get education records by user ID
router.get('/identities/:id/social_media', getSocialByIdentityId);

export default router;