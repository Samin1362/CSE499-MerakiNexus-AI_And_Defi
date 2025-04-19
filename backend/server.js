import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import productRoutes from "./routes/product.route.js";
import uploadRoutes from "./routes/upload.route.js";
import artRoutes from "./routes/art.route.js";
import cors from 'cors';  // Import CORS middleware
import daoRoutes from "./routes/dao.route.js";
import hostRoutes from "./routes/host.route.js";
import path from "path";


dotenv.config();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

const app = express();

// Use CORS middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://cse499-merakinexus-ai-and-defi.onrender.com'],  // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE, PATCH',
    credentials: true,
  }));

//middleware allows use to accept json in the body
app.use(express.json());

app.use("/api/products", productRoutes); 

//For Artist
app.use("/artist/api/upload", uploadRoutes);
app.use("/artist/api/art", artRoutes);

app.use("/dao/api/info", daoRoutes);
//For Host
app.use("/host/api/", hostRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend-merakiNexus/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend-merakiNexus", "dist", "index.html"));
  })
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server start at http://localhost:${PORT}`);
});