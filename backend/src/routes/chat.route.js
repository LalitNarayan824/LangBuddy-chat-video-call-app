import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getstreamToken } from '../controllers/chat.controller.js';
const router = express.Router();

router.get('/token' , protectRoute , getstreamToken);

export default router;