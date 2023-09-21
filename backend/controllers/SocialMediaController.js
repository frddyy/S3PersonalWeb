import SocialMedia from "../models/SocialMediaModel.js";
import Identity from "../models/IdentityModel.js";

export const getSocialMedia = async(req, res) => {
    try {
        const response = await SocialMedia.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getSocialByIdentityId = async (req, res) => {
  try {
    const identityId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const identity = await Identity.findByPk(userId);

    if (!identity) {
      return res.status(404).json({ message: 'Social Media not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const socialMediaRecords = await SocialMedia.findAll({
      where: {
        identity_id: identityId,
      },
    });

    res.status(200).json(socialMediaRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
