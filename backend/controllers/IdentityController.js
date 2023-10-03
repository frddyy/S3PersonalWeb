import Identity from "../models/IdentityModel.js";
import Multer from 'multer';

// Configure multer to specify where to store uploaded files and their names.
const storage = Multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/imag'); // Define the destination folder frontend
  },
  filename: (req, file, callback) => {
    // Define the filename for the uploaded file
    const extensionName = path.extname(file.originalname);
    const filename = req.body.title + extensionName;
    callback(null, filename);
  },
});

const upload = Multer({ storage: storage });

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
    if (!req.body) {
      return res.status(400).send({
        message: "Data tidak boleh kosong!"
      });
    }

    // Use the multer upload middleware to handle file uploads
    upload.single('attachment')(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload"
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;

      // Rest of your code to upload to the database and send the response
      var data = {
        name: req.body.name,
        image: file_name,
        place_of_birth: req.body.place_of_birth,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        phone_number: req.body.phone_number,
        email: req.body.email,
        description: req.body.description,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin,
        twittter: req.body.twittter,
        github: req.body.github

      };

      const createdIdentity = await Identity.create(data);
      res.status(201).json(createdIdentity);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
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