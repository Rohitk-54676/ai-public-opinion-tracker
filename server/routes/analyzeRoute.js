// server/routes/analyzeRoute.js

import express from "express";
import { analyzeTopic } from "../controllers/analyzeController.js";

const router = express.Router();

router.post("/", analyzeTopic);

export default router;