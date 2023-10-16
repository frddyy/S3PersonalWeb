import Education from "../models/EducationModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";
import fs from "fs";

const createStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/education");
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

      const extensionName = path.extname(file.originalname);
      const schoolName = req.body.name_sch; // Only use the name from the request for creation
      const filename = `${identity.name}_education_${schoolName}${extensionName}`;

      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const createUpload = multer({ storage: createStorage });

const updateStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/education");
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

      const education = await Education.findOne({
        where: {
          id: req.params.educationId,
        },
      });
      if (!education) {
        throw new Error("education not found");
      }

      const extensionName = path.extname(file.originalname);
      const schoolName = req.body.name_sch || education.name_sch;
      const filename = `${identity.name}_education_${schoolName}${extensionName}`;

      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const updateUpload = multer({ storage: updateStorage });

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

export const createEducation = async (req, res) => {
  try {
    createUpload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "file cannot upload",
        });
      }

      const { name_sch, start_year, end_year, major, information } = req.body;

      let file_name = null; // Default to null for image
      if (req.file) {
        file_name = req.file.filename;
      }

      await Education.create({
        name_sch,
        image: file_name,
        start_year,
        end_year,
        major,
        information,
        identityId: req.params.identityId,
      });
      res.status(201).json({ msg: "Education created" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findOne({
      where: {
        id: req.params.educationId,
      },
    });

    if (!education)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    updateUpload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      let file_name = education.image; // Default to the old image

      if (req.file) {
        // If there's a new uploaded image
        if (education.image) {
          // Check if the old image exists
          // Remove the old image file
          const oldImagePath = path.join(
            "src/image/education",
            education.image
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Gagal menghapus file lampiran lama:", err);
              return res
                .status(500)
                .json({ msg: "Gagal menghapus file lampiran lama" });
            }
          });
        }
        file_name = req.file.filename; // Update to the new image
      }

      const schoolName = req.body.name_sch || education.name_sch;
      const { start_year, end_year, major, information } = req.body;

      if (req.params.identityId == education.identityId) {
        await Education.update(
          {
            name_sch: schoolName,
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

        return res.status(200).json({ msg: "Education updated successfully" });
      } else {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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
      // Jika education memiliki image
      if (education.image) {
        const imagePath = path.join("src/image/education", education.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran" });
          }

          Education.destroy({
            where: {
              [Op.and]: [
                { id: education.id },
                { identityId: req.params.identityId },
              ],
            },
          }).then(() => {
            res.status(200).json({ msg: "Education entry deleted" });
          });
        });
      } else {
        // Jika education tidak memiliki image
        await Education.destroy({
          where: {
            [Op.and]: [
              { id: education.id },
              { identityId: req.params.identityId },
            ],
          },
        });
        res.status(200).json({ msg: "Education entry deleted" });
      }
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
