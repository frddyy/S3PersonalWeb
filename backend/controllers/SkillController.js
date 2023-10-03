import Skill from "../models/SkillModel.js";
import Identity from "../models/IdentityModel.js";

export const getSkill = async(req, res) => {
    try {
        const response = await Skill.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getSkillByIdentityId = async (req, res) => {
  try {
    const identityId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const identity = await Identity.findByPk(userId);

    if (!identity) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const skillRecords = await Skill.findAll({
      where: {
        identityId: identityId,
      },
    });

    res.status(200).json(skillRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};