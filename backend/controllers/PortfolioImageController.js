import Portfolio from "../models/PortfolioModel.js";
import PortfolioImage from "../models/PortfolioImageModel.js";
import path from "path";
import multer from "multer";
import { Op } from "sequelize";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/portfolio_image"); // Define the destination folder
  },
  filename: async (req, file, callback) => {
    try {
      // Get the associated Identity's name
      const portfolio = await Portfolio.findOne({
        where: {
          id: req.params.portfolioId,
        },
      });

      if (!portfolio) {
        throw new Error("portfolio not found");
      }

      const imageCount = await PortfolioImage.count({
        where: {
          portfolioId: req.params.portfolioId,
        },
      });

      const extensionName = path.extname(file.originalname);
      const filename = `${portfolio.title}_${imageCount + 1}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const upload = multer({ storage: storage, limits: { files: 10 } });

export const getPortfolioImage = async (req, res) => {
  try {
    let response = await PortfolioImage.findAll({
      where: {
        portfolioId: req.params.portfolioId,
      },
      include: [
        {
          model: Portfolio,
          attributes: ["title"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getPortfolioImageById = async (req, res) => {
  try {
    const portfolioimage = await PortfolioImage.findOne({
      where: {
        id: req.params.portfolioImageId,
      },
    });

    if (!portfolioimage)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    response = await PortfolioImage.findOne({
      where: {
        [Op.and]: [
          { id: portfolioimage.id },
          { portfolioId: req.params.portfolioId },
        ],
      },
      include: [
        {
          model: Portfolio,
          attributes: ["title"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPortfolioImage = async (req, res) => {
  try {
    // Use the multer upload middleware to handle multiple file uploads
    upload.array("image", 10)(req, res, async (err) => {
      // "attachments" sesuai dengan name pada input file
      if (err) {
        return res.status(500).send({
          message: "Files cannot be upload",
        });
      }
      // Files upload was successful, now you can access req.files
      const files = req.files.map((file) => file.filename);
      // Create a new portfolio entry for each uploaded file
      const portfolioimagePromises = files.map(async (file_name) => {
        await PortfolioImage.create({
          image: file_name,
          portfolioId: req.params.portfolioId,
        });
      });

      // Wait for all portfolio entries to be created
      await Promise.all(portfolioimagePromises);
      res.status(201).json({ msg: "Portfolios Image Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePortfolioImage = async (req, res) => {
  try {
    const portfolioimage = await PortfolioImage.findOne({
      where: {
        id: req.params.portfolioImageId,
      },
    });

    if (!portfolioimage)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      const file_name = req.file.filename;

      if (req.params.portfolioId == portfolioimage.portfolioId) {
        // Hapus file lampiran lama dari direktori lokal
        const oldImagePath = path.join(
          "src/image/portfolio_image",
          portfolioimage.image
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }

          // Update data portofolio dengan file lampiran yang baru
          PortfolioImage.update(
            { image: file_name },
            {
              where: {
                [Op.and]: [
                  { id: portfolioimage.id },
                  { portfolioId: req.params.portfolioId },
                ],
              },
            }
          )
            .then(() => {
              res
                .status(200)
                .json({ msg: "Portfolio image updated successfully" });
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

export const deletePortfolioImage = async (req, res) => {
  try {
    const portfolioimage = await PortfolioImage.findOne({
      where: {
        id: req.params.portfolioImageId,
      },
    });

    if (!portfolioimage)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.params.portfolioId == portfolioimage.portfolioId) {
      // Hapus file lampiran dari direktori lokal
      const imagePath = path.join(
        "src/image/portfolio_image",
        portfolioimage.image
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        // Setelah file terhapus, hapus juga data portofolio dari database
        PortfolioImage.destroy({
          where: {
            [Op.and]: [
              { id: portfolioimage.id },
              { portfolioId: req.params.portfolioId },
            ],
          },
        })
          .then(() => {
            res
              .status(200)
              .json({ msg: "Portfolio Image deleted successfully" });
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
