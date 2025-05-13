import Art from "../models/art.model.js";
import mongoose from "mongoose";
import Dao from "../models/dao.model.js";
import Artist from "../models/artist.model.js";


export const getArt = async (req, res) => {
    try {
        const art = await Art.find({artOwnerType: "Artist"});
        // const daoInfo = await Dao.findById("67ff5c10e73016ea73a80cb4");

        res.status(200).json({success:true, data: art});
    } catch (error) {
        console.log("Error is: " + error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }
}

export const deleteArt = async (req, res) => {
    const {id} = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false, message:"Invalid Id"});
    }

    try {

        const art = await Art.findById(id); 

        if (art.artOwnerType === "Artist") {

          //Connection with DAO database
          const dao = await Dao.findById("67ff5c10e73016ea73a80cb4");
          const totalArtScore = dao.totalArtScore;
          const daoToken = dao.daoToken;

          //Updating total aesthetic score
          const updateScore = parseFloat(dao.totalArtScore) - art.aesthetic_score;
          await Dao.findByIdAndUpdate("67ff5c10e73016ea73a80cb4", {totalArtScore: updateScore}, {new: true})

          //Updating selling price
          const arts = await Art.find({artOwnerType: "Artist"});
          const updatedArts = [];
          for (const art of arts) {
            const artAestheticScore = parseFloat(art.aesthetic_score); // Ensure this is a number
              
            // Calculate the selling price based on the formula
            const sellingPrice = (artAestheticScore / updateScore) * daoToken;
              
            // Update the art document with the new selling price
            const updatedArt = await Art.findByIdAndUpdate(
            art._id,
            { sellingPrice: sellingPrice }, // Update selling price
            { new: true } // Return the updated document
            );
              
            updatedArts.push(updatedArt); // Store the updated arts
          }
          
        }

        await Art.findByIdAndDelete(id);

        res.status(200).json({success:true, message: "Art Deleted"});
    } catch (error) {
        console.error("Error is: " + error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const transactionArt = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false, message: "Invalid ID"});
    }

    try {
        const art = await Art.findById(id);
        res.status(200).json({success:true, data: art});
    } catch (error) {
        console.error("Transaction failed: ", error.message);
        res.status(500).json({success:false, message:"Server Error"});
    }
}

export const transferArt = async (req, res) => {
  const { id } = req.params;  // Get the art ID from URL

  // Get the artwork by ID from the database
  const art = await Art.findById(id); 

  if (!art) {
    return res.status(404).json({ success: false, message: 'Art not found' });
  }


  try {

    // Update the art ownership details in the database
    art.artOwnerType = 'Host';  // Change owner type to 'host'

    // Save the updated art object in the database
    const updatedArt = await art.save();

    // Updating DAO
    const dao = await Dao.findById("67ff5c10e73016ea73a80cb4");
    const totalArtScore = dao.totalArtScore;
    const daoToken = dao.daoToken;

    const updateScore = parseFloat(totalArtScore) - art.aesthetic_score;
    const updateDaoToken = parseFloat(daoToken) - art.sellingPrice;

    // Updating Artist 
    const artist = await Artist.findById("6801e3c540da05e6e847c811");

    const artistBalance = parseFloat(artist.ArtistBalance);
    const validBalance = isNaN(artistBalance) ? 0 : artistBalance;
    const updatedArtistBalance = parseFloat(artist.ArtistBalance) + art.sellingPrice; 

    await Dao.findByIdAndUpdate("67ff5c10e73016ea73a80cb4", {totalArtScore: updateScore, daoToken: updateDaoToken}, {new: true})
    await Artist.findByIdAndUpdate("6801e3c540da05e6e847c811", {ArtistBalance: updatedArtistBalance}, {new: true})

    //Updating selling price
    const arts = await Art.find({artOwnerType: "Artist"});
    const updatedArts = [];
    for (const art of arts) {
      const artAestheticScore = parseFloat(art.aesthetic_score); // Ensure this is a number
        
      // Calculate the selling price based on the formula
      const sellingPrice = (artAestheticScore / updateScore) * updateDaoToken;
        
      // Update the art document with the new selling price
      const updatedArt = await Art.findByIdAndUpdate(
      art._id,
      { sellingPrice: sellingPrice}, // Update selling price
      { new: true } // Return the updated document
      );
        
      updatedArts.push(updatedArt); // Store the updated arts
    }

    // Respond with the updated art details and success message
    res.status(200).json({
      success: true,
      message: 'Transaction successful and art ownership updated.',
      art: updatedArt,
    });
  } catch (err) {
    console.error('Transaction failed:', err);
    res.status(500).json({ success: false, message: 'Transaction failed. Please try again.' });
  }
};
