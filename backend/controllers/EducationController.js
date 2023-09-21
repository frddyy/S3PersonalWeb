import Education from "../models/EducationModel.js";
import User from "../models/UserModel.js";

export const getEducation = async(req, res) => {
    try {
        const response = await Education.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getEducationByUserId = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const educationRecords = await Education.findAll({
      where: {
        user_id: userId,
      },
    });

    res.status(200).json(educationRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
