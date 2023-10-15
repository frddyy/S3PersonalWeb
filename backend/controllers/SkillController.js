import Skill from "../models/SkillModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";
import fs from "fs";

// Configure multer to specify where to store uploaded files and their names.
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

const upload = multer({ storage: storage });

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
    upload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;
      const { title, level } = req.body;
      await Skill.create({
        title: title,
        thumbnail: file_name,
        level: level,
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

    upload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      const file_name = req.file.filename;
      const { title, level } = req.body;

      if (req.params.identityId == skill.identityId) {
        // Hapus file lampiran lama dari direktori lokal
        const oldImagePath = path.join("src/image/skill", skill.thumbnail);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }

          // Update data skill dengan file lampiran yang baru
          Skill.update(
            { title, thumbnail: file_name, level },
            {
              where: {
                [Op.and]: [
                  { id: skill.id },
                  { identityId: req.params.identityId },
                ],
              },
            }
          );
        });
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

    if (!skill) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.params.identityId == skill.identityId) {
      // Hapus file lampiran dari direktori lokal
      const imagePath = path.join("src/image/skill", skill.thumbnail);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        Skill.destroy({
          where: {
            [Op.and]: [{ id: skill.id }, { identityId: req.params.identityId }],
          },
        });
      });
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }

    res.status(200).json({ msg: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
