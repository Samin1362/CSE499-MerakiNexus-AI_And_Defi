import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descriptionByArtist: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, // This will store the Base64 string of the image
  },
  aesthetic_score: {
    type: String,
  },
  sentiment_score: {
    type: String,
  },
  memorability_score: {
    type: String,
  },
  descriptionByModel: {
    type: String,
  },
  artOwnerType: {
    type: String, 
  }, 
  ownerWalletAddress: {
    type: String, 
  }, 
  artistToken: {
    type: Number, 
  }, 
  hostToken: {
    type: Number,
  }, 
  sellingPrice: {
    type: Number,
  },
  artistBalance: {
    type: Number, 
  }, 
  artistWalletAddress: {
    type: String, 
  }, 
}, {
  timestamps: true,
});

const Art = mongoose.model('Art', ArtSchema);

export default Art;
