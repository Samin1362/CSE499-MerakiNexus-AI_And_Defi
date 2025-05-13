import express from "express";
import { getDao, putDao } from "../controllers/dao.controller.js";

const router = express.Router();

router.get("/", getDao);
router.put("/host", putDao);

export default router; 