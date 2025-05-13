import express from "express";
import { getArt, deleteArt, transactionArt, transferArt } from "../controllers/art.controller.js";
import { getArtist } from "../controllers/artist.controller.js";

const router = express.Router();

router.get("/", getArt);
router.get("/artistInfo", getArtist);
router.delete("/:id", deleteArt);
router.get("/transaction/:id", transactionArt);
router.patch("/transaction/transfer/:id", transferArt);

export default router;