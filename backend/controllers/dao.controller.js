import Dao from "../models/dao.model.js";
import Art from "../models/art.model.js";
import mongoose from "mongoose";

export const getDao = async (req, res) => {
    try {
        const info = await Dao.findById("67ff5c10e73016ea73a80cb4");
        res.status(200).json({success: true, data: info});
    } catch (error) {
        res.status(500).json({success:false, data:error});
    }
}

export const putDao = async (req, res) => {
    try {

      const { daoToken } = req.body; 

      // Fetch the DAO document to get daoToken and totalArtScore
      const dao = await Dao.findById("67ff5c10e73016ea73a80cb4");
  
      if (!dao) {
        return res.status(404).json({ success: false, message: "DAO not found" });
      }
  
      // Extract daoToken and totalArtScore from the DAO document
      const totalArtScore = dao.totalArtScore;

      dao.daoToken = daoToken;
      await dao.save();
  
      // Get all the art documents
      const arts = await Art.find({});
  
      // Check if there are arts in the collection
      if (arts.length === 0) {
        return res.status(404).json({ success: false, message: "No arts found" });
      }
  
      // Calculate and update the selling price for each art
      const updatedArts = [];
      for (const art of arts) {
        const artAestheticScore = parseFloat(art.aesthetic_score); // Ensure this is a number
  
        // Calculate the selling price based on the formula
        const sellingPrice = (artAestheticScore / totalArtScore) * daoToken;
  
        // Update the art document with the new selling price
        const updatedArt = await Art.findByIdAndUpdate(
          art._id,
          { sellingPrice: sellingPrice }, // Update selling price
          { new: true } // Return the updated document
        );
  
        updatedArts.push(updatedArt); // Store the updated arts
      }
  
      // Return a success response
      res.status(200).json({
        success: true,
        message: "Selling prices updated successfully",
        updatedArts: updatedArts, // Return updated arts for reference
      });
    } catch (error) {
      console.error("Error updating selling prices:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };