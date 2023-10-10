import Education from "../models/EducationModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";
import fs from "fs";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/education"); // Define the destination folder
  },
  filename: async (req, file, callback) => {
    try {
      const identity = await Identity.findOne({
        where: {
          id: req.params.identityId,
        },
      });
      if (!identity) {
        throw new Error("identity not found");
      }
      // Define the filename for the uploaded file
      const extensionName = path.extname(file.originalname);
      const filename = `${identity.name}_education_${req.body.name_sch}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const upload = multer({ storage: storage });

// Get all education records
export const getEducation = async (req, res) => {
  try {
    let response = await Education.findAll({
      where: {
        identityId: req.params.identityId,
      },
      include: [
        {
          model: Identity,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
  }
};

// Get education records by identity_id
export const getEducationById = async (req, res) => {
  try {
    const education = await Education.findOne({
      where: {
        id: req.params.educationId,
      },
    });

    if (!education)
      return res.status(404).json({ msg: "data tidak ditemukan" });

    let response;
    response = await Education.findOne({
      where: {
        [Op.and]: [{ id: education.id }, { identityId: req.params.identityId }],
      },
      include: [
        {
          model: Identity,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new education record
export const createEducation = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "file cannot upload",
        });
      }

      const file_name = req.file.filename;
      const { name_sch, start_year, end_year, major, information } = req.body;
      await Education.create({
        name_sch: name_sch,
        image: file_name,
        start_year: start_year,
        end_year: end_year,
        major: major,
        information: information,
        identityId: req.params.identityId,
      });
      res.status(201).json({ msg: "Education created" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an education record by education_id and identity_id
export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findOne({
      where: {
        id: req.params.educationId,
      },
    });

    if (!education)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      const file_name = req.file.filename;
      const { name_sch, start_year, end_year, major, information } = req.body;

      if (req.params.identityId == education.identityId) {
        // Hapus file lampiran lama dari direktori lokal
        const oldImagePath = path.join("src/image/education", education.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }

          // Update data portofolio dengan file lampiran yang baru
          Education.update(
            {
              name_sch,
              image: file_name,
              start_year,
              end_year,
              major,
              information,
            },
            {
              where: {
                [Op.and]: [
                  { id: education.id },
                  { identityId: req.params.identityId },
                ],
              },
            }
          );
        });
      } else {
        return res.status(403).json({ msg: "Akses terlarang" });
      }

      res.status(200).json({ msg: "Organization updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
// Delete an education record by education_id and identity_id
export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findOne({
      where: {
        id: req.params.educationId,
      },
    });

    if (!education)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.params.identityId == education.identityId) {
      const imagePath = path.join("src/image/education", education.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        Education.destroy({
          where: {
            [Op.and]: [
              { id: education.id },
              { identityId: req.params.identityId },
            ],
          },
        });
      });
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }

    res.status(200).json({ msg: "Education entry deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
