import express from "express";
import { getHost } from "../controllers/host.controller.js";

const router = express.Router();

router.get("/", getHost);

export default router;