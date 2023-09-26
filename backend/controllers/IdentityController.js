import Identity from "../models/IdentityModel.js";
import User from "../models/UserModel.js";

// Mendapatkan semua identitas
export const getIdentity = async (req, res) => {
  try {
    const identities = await Identity.findAll();
    res.status(200).json(identities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mendapatkan identitas berdasarkan ID
export const getIdentityById = async (req, res) => {
  const identityId = req.params.id;

  try {
    const identity = await Identity.findByPk(identityId);

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    res.status(200).json(identity);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mendapatkan identitas berdasarkan user_id
export const getIdentityByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const identities = await Identity.findAll({
      where: {
        userId: userId,
      },
    });

    res.status(200).json(identities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new identity record
export const createIdentity = async (req, res) => {
  try {
    const createdIdentity = await Identity.create(req.body);
    res.status(200).json({ msg: "Identity created" });
    res.status(201).json(createdIdentity);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateIdentity = async (req, res) => {
  try {
    const userId = req.params.userId; // Merujuk ke user_id
    const identityId = req.params.identityId; // Merujuk ke identity_id

    const [updatedRowCount] = await Identity.update(req.body, {
      where: {
        id: identityId,
        userId: userId, // Merujuk ke user_id
      },
    });

    if (updatedRowCount === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json({ msg: "Identity entry updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteIdentity = async (req, res) => {
  try {
    const userId = req.params.userId;
    const identityId = req.params.identityId;

    // Menggunakan destroy untuk menghapus identitas berdasarkan kriteria
    const deletedRowCount = await Identity.destroy({
      where: {
        id: identityId,
        userId: userId,
      },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json({ msg: "Identity entry deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get education by education_id and user_id
export const getIdentityByIdentityIdAndUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const identityId = req.params.identityId;

    const identityData = await Identity.findOne({
      where: {
        id: identityId,
        userId: userId,
      },
    });

    if (!identityData) {
      return res.status(404).json({ error: "Identity entry not found" });
    }

    res.status(200).json(identityData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};