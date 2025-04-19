import express from "express";
import multer from "multer";
import { createArt } from "../controllers/upload.controller.js";

const storage = multer.memoryStorage();

const upload = multer({storage});
const router = express.Router();

// Route to handle creating art and uploading the image as Base64 string
router.post("/", upload.single('image'), createArt);

export default router;

