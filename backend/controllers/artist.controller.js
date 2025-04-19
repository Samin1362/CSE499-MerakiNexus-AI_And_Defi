import Artist from "../models/artist.model.js";

export const getArtist = async (req, res) => {
    const artist = await Artist.findById("6801e3c540da05e6e847c811")
    res.status(200).json({success: true, data: artist})
}