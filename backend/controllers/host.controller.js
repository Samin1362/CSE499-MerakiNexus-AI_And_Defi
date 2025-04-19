import Art from "../models/art.model.js";


export const getHost = async (req, res) => {

    try {
        const hostArt = await Art.find({artOwnerType: "Host"})
        res.status(200).json({success: true, data: hostArt});
    } catch (error) {
        res.status(500).json({success: false, data: error.message});
    }

}