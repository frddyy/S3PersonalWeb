import Portfolio from "../models/PortfolioModel.js";
import Identity from "../models/IdentityModel.js";
import PortfolioImage from "../models/PortfolioImageModel.js";
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

const createUpload = multer({ storage: storage });

const updateStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/portfolio");
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

      const portfolio = await Portfolio.findOne({
        where: {
          id: req.params.portfolioId,
        },
      });
      if (!portfolio) {
        throw new Error("portfolio not found");
      }

      const extensionName = path.extname(file.originalname);
      const titleName = req.body.title || portfolio.title;
      const filename = `${identity.name}_portfolio_${titleName}${extensionName}`;

      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const updateUpload = multer({ storage: updateStorage });

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
    createUpload.single("attachment")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      const { title, description } = req.body;

      let file_name = null; // Default to null for image
      if (req.file) {
        file_name = req.file.filename;
      }
      await Portfolio.create({
        title,
        description,
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

    updateUpload.single("attachment")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      let file_name = portfolio.attachment; // Default to the old image

      if (req.file) {
        // If there's a new uploaded image
        if (portfolio.attachment) {
          // Check if the old image exists
          // Remove the old image file
          const oldImagePath = path.join(
            "src/image/portfolio",
            portfolio.attachment
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

      const titleName = req.body.title || portfolio.title;
      const { description } = req.body;

      if (req.params.identityId == portfolio.identityId) {
        await Portfolio.update(
          { title: titleName, description, attachment: file_name },
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
      // If the portfolio has an attachment
      if (portfolio.attachment) {
        const attachmentPath = path.join(
          "src/image/portfolio",
          portfolio.attachment
        );

        fs.unlink(attachmentPath, async (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran" });
          }

          // Deleting data from PortfolioImage model
          try {
            await PortfolioImage.destroy({
              where: {
                portfolioId: req.params.portfolioId,
              },
            });

            await Portfolio.destroy({
              where: {
                [Op.and]: [
                  { id: portfolio.id },
                  { identityId: req.params.identityId },
                ],
              },
            });

            res.status(200).json({
              msg: "Portfolio and related PortfolioImage data deleted successfully",
            });
          } catch (error) {
            console.error("Gagal menghapus data:", error);
            res.status(500).json({ msg: "Gagal menghapus data" });
          }
        });
      } else {
        // If portfolio doesn't have an attachment
        await Portfolio.destroy({
          where: {
            [Op.and]: [
              { id: portfolio.id },
              { identityId: req.params.identityId },
            ],
          },
        });
        res.status(200).json({ msg: "Portfolio entry deleted" });
      }
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
