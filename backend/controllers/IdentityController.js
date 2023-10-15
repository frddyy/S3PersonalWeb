import Identity from "../models/IdentityModel.js";
import User from "../models/UserModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import fs from "fs";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/identity"); // Define the destination folder
  },
  filename: async (req, file, callback) => {
    try {
      const extensionName = path.extname(file.originalname);
      const filename = `identity_${req.body.name}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const upload = multer({ storage: storage });

// Mendapatkan semua identitas
export const getIdentity = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Identity.findAll({
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });
    } else {
      response = await Identity.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Mendapatkan identitas berdasarkan user ID
export const getIdentityById = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    if (req.role === "admin" || identity.userId === req.userId) {
      response = await Identity.findOne({
        where: {
          id: identity.id,
        },
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });
    } else {
      response = await Identity.findOne({
        where: {
          [Op.and]: [{ id: identity.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["username", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new identity record
export const createIdentity = async (req, res) => {
  try {
    // Use the multer upload middleware to handle file uploads
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;
      const {
        name,
        place_of_birth,
        date_of_birth,
        address,
        phone_number,
        email,
        description,
        instagram,
        linkedin,
        twitter,
        github,
      } = req.body;
      await Identity.create({
        name: name,
        image: file_name,
        place_of_birth: place_of_birth,
        date_of_birth: date_of_birth,
        address: address,
        phone_number: phone_number,
        email: email,
        description: description,
        instagram: instagram,
        linkedin: linkedin,
        twitter: twitter,
        github: github,
        userId: req.userId,
      });
      res.status(201).json({ msg: "Identity Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      // Jika tidak ada file yang diupload, gunakan image sebelumnya
      const file_name = req.file ? req.file.filename : identity.image;

      if (req.file) {
        // Hanya hapus gambar lama jika ada gambar baru yang diupload
        const oldImagePath = path.join("src/image/identity", identity.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }
        });
      }

      const {
        name,
        place_of_birth,
        date_of_birth,
        address,
        phone_number,
        email,
        description,
        instagram,
        linkedin,
        twitter,
        github,
      } = req.body;

      const updateData = {
        name,
        image: file_name,
        place_of_birth,
        date_of_birth,
        address,
        phone_number,
        email,
        description,
        instagram,
        linkedin,
        twitter,
        github,
      };

      const updateWhere =
        req.role === "admin" || identity.userId === req.userId
          ? { id: identity.id }
          : { id: identity.id, userId: req.userId };

      Identity.update(updateData, {
        where: updateWhere,
      })
        .then(() => {
          res.status(200).json({ msg: "Identity updated succesfully" });
        })
        .catch((error) => {
          console.error("Gagal mengupdate data:", error);
          res.status(500).json({ msg: "Gagal mengupdate data" });
        });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin" || identity.userId === req.userId) {
      const imagePath = path.join("src/image/identity", identity.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        Identity.destroy({
          where: {
            id: identity.id,
          },
        });
      });
    } else {
      if (req.userId !== identity.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }
        Identity.destroy({
          where: {
            [Op.and]: [{ id: identity.id }, { userId: req.userId }],
          },
        });
      });
    }
    res.status(200).json({ msg: "Identity deleted succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
