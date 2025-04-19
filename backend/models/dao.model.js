import mongoose from "mongoose";

const DaoSchema = new mongoose.Schema({
  daoToken: {
    type: Number,     //number of token delivered by host
  }, 
  totalArtScore: {
    type: Number,     //Sum of total number of tokens
  }
}, {
  timestamps: true,
});

const Dao = mongoose.model('Dao', DaoSchema);

export default Dao;
