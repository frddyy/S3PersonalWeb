import Education from "../models/EducationModel.js";

// Get all education records
export const getEducation = async (req, res) => {
  try {
    const response = await Education.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get education records by identity_id
export const getEducationById = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const educationData = await Education.findAll({
      where: {
        identityId: identityId,
      },
    });

    res.status(200).json(educationData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get education by education_id and user_id
export const getEducationByEducationIdAndIdentityId = async (req, res) => {
  try {
    const identityId = req.params.identityId;
    const educationId = req.params.educationId;

    const educationData = await Education.findOne({
      where: {
        id: educationId,
        identityId: identityId,
      },
    });

    if (!educationData) {
      return res.status(404).json({ error: "Education entry not found" });
    }

    res.status(200).json(educationData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new education record
export const createEducation = async (req, res) => {
  try {
    const createdEducation = await Education.create(req.body);
    res.status(200).json({ msg: "Education created" });
    res.status(201).json(createdEducation);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an education record by education_id and identity_id
export const updateEducation = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const educationId = req.params.educationId; // Assuming the education_id is provided as a URL parameter

    const [updatedRowCount] = await Education.update(req.body, {
      where: {
        id: educationId,
        identityId: identityId,
      },
    });

    if (updatedRowCount === 0) {
      // No matching education entry found
      return res.status(404).json({ error: "Education entry not found" });
    }

    res.status(200).json({ msg: "Education entry updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an education record by education_id and identity_id
export const deleteEducation = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const educationId = req.params.educationId; // Assuming the education_id is provided as a URL parameter

    const deletedRowCount = await Education.destroy({
      where: {
        id: educationId,
        identityId: identityId,
      },
    });

    if (deletedRowCount === 0) {
      // No matching education entry found
      return res.status(404).json({ error: "Education entry not found" });
    }

    res.status(200).json({ msg: "Education entry deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
