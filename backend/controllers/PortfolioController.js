import Portfolio from "../models/PortfolioModel.js";
import Identity from "../models/IdentityModel.js";
import path from "path";
import multer from "multer";
import { Op } from "sequelize";
import fs from "fs";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/portfolio"); // Define the destination folder
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
      const filename = `${identity.name}_portfolio_${req.body.title}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const upload = multer({ storage: storage });

export const getPortfolio = async (req, res) => {
  try {
    let response = await Portfolio.findAll({
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

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.portfolioId,
      },
    });

    if (!portfolio)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    response = await Portfolio.findOne({
      where: {
        [Op.and]: [{ id: portfolio.id }, { identityId: req.params.identityId }],
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

export const createPortfolio = async (req, res) => {
  try {
    // Use the multer upload middleware to handle file uploads
    upload.single("attachment")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;
      const { title, description } = req.body;
      await Portfolio.create({
        title: title,
        description: description,
        attachment: file_name,
        identityId: req.params.identityId,
      });
      res.status(201).json({ msg: "Portfolio Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.portfolioId,
      },
    });

    if (!portfolio)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    upload.single("attachment")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      const file_name = req.file.filename;
      const { title, description } = req.body;

      if (req.params.identityId == portfolio.identityId) {
        // Hapus file lampiran lama dari direktori lokal
        const oldAttachmentPath = path.join(
          "src/image/portfolio",
          portfolio.attachment
        );
        fs.unlink(oldAttachmentPath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }

          // Update data portofolio dengan file lampiran yang baru
          Portfolio.update(
            { title, description, attachment: file_name },
            {
              where: {
                [Op.and]: [
                  { id: portfolio.id },
                  { identityId: req.params.identityId },
                ],
              },
            }
          )
            .then(() => {
              res.status(200).json({ msg: "Portfolio updated successfully" });
            })
            .catch((error) => {
              res.status(500).json({ msg: error.message });
            });
        });
      } else {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.portfolioId,
      },
    });

    if (!portfolio)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.params.identityId == portfolio.identityId) {
      // Hapus file lampiran dari direktori lokal
      const attachmentPath = path.join(
        "src/image/portfolio",
        portfolio.attachment
      );
      fs.unlink(attachmentPath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        // Setelah file terhapus, hapus juga data portofolio dari database
        Portfolio.destroy({
          where: {
            [Op.and]: [
              { id: portfolio.id },
              { identityId: req.params.identityId },
            ],
          },
        })
          .then(() => {
            res.status(200).json({ msg: "Portfolio deleted successfully" });
          })
          .catch((error) => {
            res.status(500).json({ msg: error.message });
          });
      });
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
