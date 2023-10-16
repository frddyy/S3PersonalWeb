import Skill from "../models/SkillModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/skill"); // Define the destination folder
  },
  filename: async (req, file, callback) => {
    try {
      // Get the associated Identity's name
      const identity = await Identity.findOne({
        where: {
          id: req.params.identityId,
        },
      });

      if (!identity) {
        throw new Error("Identity not found");
      }

      const extensionName = path.extname(file.originalname);
      const filename = `${identity.name}_skill_${req.body.title}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const createUpload = multer({ storage: storage });

const updateStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/skill");
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

      const skill = await Skill.findOne({
        where: {
          id: req.params.skillId,
        },
      });
      if (!skill) {
        throw new Error("skill not found");
      }

      const extensionName = path.extname(file.originalname);
      const titleName = req.body.title || skill.title;
      const filename = `${identity.name}_skill_${titleName}${extensionName}`;

      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const updateUpload = multer({ storage: updateStorage });

export const getSkill = async (req, res) => {
  try {
    let response = await Skill.findAll({
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
    console.log(error);
  }
};

export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      where: {
        id: req.params.skillId,
      },
    });

    if (!skill) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    response = await Skill.findOne({
      where: {
        [Op.and]: [{ id: skill.id }, { identityId: req.params.identityId }],
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
    res.status(500).json({ msg: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    // Use the multer upload middleware to handle file uploads
    createUpload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      const { title, level } = req.body;

      let file_name = null; // Default to null for image
      if (req.file) {
        file_name = req.file.filename;
      }

      await Skill.create({
        title,
        thumbnail: file_name,
        level,
        identityId: req.params.identityId,
      });
      res.status(201).json({ msg: "Skill Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      where: {
        id: req.params.skillId,
      },
    });

    if (!skill) return res.status(404).json({ msg: "Data tidak ditemukan" });

    updateUpload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      let file_name = skill.image;

      if (req.file) {
        // If there's a new uploaded image
        if (skill.image) {
          // Check if the old image exists
          // Remove the old image file
          const oldImagePath = path.join("src/image/skill", skill.image);
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
      const titleName = req.body.title || skill.title;
      const { level } = req.body;

      if (req.params.identityId == skill.identityId) {
        await Skill.update(
          { title: titleName, thumbnail: file_name, level },
          {
            where: {
              [Op.and]: [
                { id: skill.id },
                { identityId: req.params.identityId },
              ],
            },
          }
        );
      } else {
        return res.status(403).json({ msg: "Akses terlarang" });
      }

      res.status(200).json({ msg: "Skill updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      where: {
        id: req.params.skillId,
      },
    });

    if (!skill) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    if (req.params.identityId == skill.identityId) {
      // Jika skill memiliki thumbnail
      if (skill.thumbnail) {
        const imagePath = path.join("src/image/skill", skill.thumbnail);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran" });
          }

          Skill.destroy({
            where: {
              [Op.and]: [
                { id: skill.id },
                { identityId: req.params.identityId },
              ],
            },
          }).then(() => {
            res.status(200).json({ msg: "Skill deleted successfully" });
          });
        });
      } else {
        // Jika skill tidak memiliki thumbnail
        await Skill.destroy({
          where: {
            [Op.and]: [{ id: skill.id }, { identityId: req.params.identityId }],
          },
        });
        res.status(200).json({ msg: "Skill deleted successfully" });
      }
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
