import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  ArtistBalance: {
    type: Number,     
  }, 
  ArtistWalletAddress: {
    type: String,     
  }
}, {
  timestamps: true,
});

const Artist = mongoose.model('Artist', ArtistSchema);

export default Artist;