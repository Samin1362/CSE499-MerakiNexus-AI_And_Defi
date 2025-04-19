import Art from "../models/art.model.js";
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs'; 
import { fileURLToPath } from 'url';  // To get the current directory in ES modules
import Dao from "../models/dao.model.js";
import axios from "axios";

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to call the Python script for inference
function runPythonInference(imagePath) {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, 'aesthetic_infer_model.py');
        
        // Run the Python script with the image path as an argument
        exec(`python -u ${pythonScriptPath} ${imagePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${stderr}`);
                reject(`Error: ${stderr}`);
            } else {
                try {
                    const result = JSON.parse(stdout);  // Parse the JSON output from Python
                    resolve(result);  // Resolve with the result from Python
                } catch (err) {
                    reject('Error parsing JSON output from Python');
                }
            }
        });
    });
}

// Function to download the image from a URL
const downloadImage = async (url, filePath) => {
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

export const createArt = async (req, res) => {
    const art = req.body;

    let imageBase64;
    let imageBuffer;
    if (req.file){
        imageBase64 = req.file ? req.file.buffer.toString("base64") : null;
        imageBuffer = req.file.buffer;
    }

    console.log(art.imageUrl)

    if (!art.name || !art.descriptionByArtist || !(req.file || art.imageUrl)) {
        return res.status(400).json({ success: false, message: "Provide all the fields" });
    }

    try {

        let tempFilePath;

        // If there is an image URL, download the image
        if (art.imageUrl) {
            // Define temporary file path for downloaded image
            tempFilePath = path.join(__dirname, 'temp_image.png');
            await downloadImage(art.imageUrl, tempFilePath); // Download the image from URL
        } else if (imageBuffer) {
            // If image is passed directly as a file, use the buffer
            tempFilePath = path.join(__dirname, 'temp_image.png');
            fs.writeFileSync(tempFilePath, imageBuffer);  // Save buffer to a temporary file
        }

        // Running the Python script to get the aesthetic result
        const aesthetic_result = await runPythonInference(tempFilePath);
        const { weightedScore } = aesthetic_result;  // Get the aesthetic score (weighted score)

        //Connection with DAO database
        const dao = await Dao.findById("67ff5c10e73016ea73a80cb4");

        //Updating total aesthetic score
        const updateScore = parseFloat(dao.totalArtScore) + weightedScore;
        await Dao.findByIdAndUpdate("67ff5c10e73016ea73a80cb4", {totalArtScore: updateScore}, {new: true})

        const totalArtScore = dao.totalArtScore;
        const daoToken = dao.daoToken;


        // Save the artwork in MongoDB with the aesthetic score
        const newArt = new Art({
            name: art.name,
            descriptionByArtist: art.descriptionByArtist,
            image: art.imageUrl || imageBase64, // Store image as base64
            aesthetic_score: weightedScore,  // Only store the aesthetic score (weightedScore)
            artOwnerType: "Artist",
            artistToken: 0,
            hostToken: 100, 
        });

        await newArt.save();

        // Updating selling price
        const arts = await Art.find({});
        const updatedArts = [];
        let sellingPrice;

        for (const art of arts) {
        const artAestheticScore = parseFloat(art.aesthetic_score); // Ensure this is a number
        
        // Calculate the selling price based on the formula
        if (artAestheticScore === 0 || totalArtScore === 0 || isNaN(artAestheticScore) || artAestheticScore === "") {
            // If either aesthetic score or total score is zero, set selling price to the total daoToken
            sellingPrice = daoToken;
        } else {
            // If both scores are valid, calculate the selling price using the formula
            sellingPrice = (artAestheticScore / updateScore) * daoToken;
        }

        // Update the art document with the new selling price
        const updatedArt = await Art.findByIdAndUpdate(
            art._id,
            { sellingPrice: sellingPrice }, // Update selling price
            { new: true } // Return the updated document
        );

        updatedArts.push(updatedArt); // Store the updated arts
        }


        // Delete the temporary file after processing
        fs.unlinkSync(tempFilePath);

        // Send success response
        res.status(200).json({ success: true, message: "Art saved successfully" });
    } catch (error) {
        console.log("Error in creating art: " + error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
