import Art from "../models/art.model.js";
import mongoose from "mongoose";
import Dao from "../models/dao.model.js";
import Artist from "../models/artist.model.js";


// backend/controllers/artController.js
import web3Config from '../config/web3Config.js'; // Import the web3Config

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

  // Initialize Web3 instance using web3Config
  const web3 = web3Config(); 

  // Get the artwork by ID from the database
  const art = await Art.findById(id); 

  if (!art) {
    return res.status(404).json({ success: false, message: 'Art not found' });
  }

  // Hardcoded private key (for now)
  const privateKey = "0x3c033bbd9133bcbfe18e6c7400151b4f6a9336c39ea764d7e598964b5e2b57ce";  // Example private key (should be stored securely)

  // If the private key isn't set, return error
  if (!privateKey) {
    return res.status(500).json({ success: false, message: 'Private key is not set' });
  }

  // Set up the transaction details
  const sender = "0xE71815766387D92def69a4E0Cc600eFa4496fA6d"; // Artist wallet (static address for now)
  const receiver = "0x4dBe45e9C44DE92A513074326b570cb5EDb3e60c"; // Host wallet (static address for now)

  // Get current gas price from the network
  const gasPrice = await web3.eth.getGasPrice();

  // Prepare the transaction
  const transaction = {
    from: sender,
    to: receiver,
    value: web3.utils.toWei('0.1', 'ether'), // Example: Send 0.1 ETH (adjust as needed)
    gas: 2000000,  // Gas limit (adjust as necessary)
    gasPrice: gasPrice,  // Gas price fetched from the network
  };

  try {
    // Estimate gas for the transaction
    const estimatedGas = await web3.eth.estimateGas(transaction);
    console.log("Estimated Gas:", estimatedGas);

    // Add estimated gas to the transaction details
    transaction.gas = estimatedGas;

    // Sign the transaction with the artist's private key
    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    
    // Send the signed transaction to the network
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction successful:', receipt);

    // Update the art ownership details in the database
    art.artOwnerType = 'Host';  // Change owner type to 'host'
    art.ownerWalletAddress = sender;  // Change wallet address to host's address

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

// import Web3 from 'web3';

// export const transferArt = async (req, res) => {
//   const { id } = req.params;  // Get the art ID from URL

//   // Initialize Web3 with MetaMask's provider
//   const web3 = new Web3(window.ethereum); // This uses MetaMask's injected provider

//   // Request account access
//   try {
//     await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request access to the user's MetaMask wallet
//   } catch (err) {
//     return res.status(400).json({ success: false, message: "User denied account access." });
//   }

//   // Get the user's wallet address
//   const accounts = await web3.eth.getAccounts();
//   const sender = accounts[0]; // Use the first account (sender)

//   // Get the artwork by ID from the database
//   const art = await Art.findById(id); 

//   if (!art) {
//     return res.status(404).json({ success: false, message: 'Art not found' });
//   }

//   const receiver = "0x27894EbD7Cd9b82C851076B4737ab40dEc340553"; // Static receiver wallet address for now

//   // Prepare the transaction
//   const transaction = {
//     from: sender,
//     to: receiver,
//     value: web3.utils.toWei('0.01', 'ether'), // Sending 0.1 ETH (you can adjust this as needed)
//     gas: 2000000,  // Gas limit
//   };

//   try {
//     // Estimate gas for the transaction
//     const estimatedGas = await web3.eth.estimateGas(transaction);
//     console.log("Estimated Gas:", estimatedGas);

//     // Add estimated gas to the transaction details
//     transaction.gas = estimatedGas;

//     // Sign the transaction using MetaMask
//     web3.eth.accounts.signTransaction(transaction, sender)
//       .then(signedTx => {
//         web3.eth.sendSignedTransaction(signedTx.rawTransaction)
//           .on('receipt', async (receipt) => {
//             console.log('Transaction successful:', receipt);

//             // Update the art ownership details in the database
//             art.artOwnerType = 'Host';  // Change owner type to 'host'
//             art.ownerWalletAddress = receiver;  // Change wallet address to host's address
//             await art.save(); // Save the updated art object in the database

//             // Update DAO details
//             const dao = await Dao.findById("67ff5c10e73016ea73a80cb4");
//             const totalArtScore = dao.totalArtScore;
//             const daoToken = dao.daoToken;

//             const updateScore = parseFloat(totalArtScore) - art.aesthetic_score;
//             const updateDaoToken = parseFloat(daoToken) - art.sellingPrice;

//             await Dao.findByIdAndUpdate("67ff5c10e73016ea73a80cb4", { totalArtScore: updateScore, daoToken: updateDaoToken }, { new: true });

//             // Update the selling price for all arts
//             const arts = await Art.find({ artOwnerType: "Artist" });
//             for (const art of arts) {
//               const artAestheticScore = parseFloat(art.aesthetic_score);
//               const sellingPrice = (artAestheticScore / updateScore) * updateDaoToken;

//               // Update the selling price for each art
//               await Art.findByIdAndUpdate(
//                 art._id,
//                 { sellingPrice: sellingPrice }, // Update selling price
//                 { new: true }
//               );
//             }

//             res.status(200).json({
//               success: true,
//               message: 'Transaction successful and art ownership updated.',
//               art: art,
//             });
//           })
//           .on('error', (err) => {
//             console.error('Transaction failed:', err);
//             res.status(500).json({ success: false, message: 'Transaction failed' });
//           });
//       });

//   } catch (err) {
//     console.error('Error in transaction:', err);
//     res.status(500).json({ success: false, message: 'Error processing the transaction' });
//   }
// };
