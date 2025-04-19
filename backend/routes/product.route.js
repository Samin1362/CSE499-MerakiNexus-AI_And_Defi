import express from "express"; 
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";


const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct); // For update all the fields put, for some fields patch
router.delete("/:id", deleteProduct);

export default router;