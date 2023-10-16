import Portfolio from "../models/PortfolioModel.js";
import PortfolioImage from "../models/PortfolioImageModel.js";
import path from "path";
import multer from "multer";
import { Op } from "sequelize";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/portfolio_image");
  },
  filename: async (req, file, callback) => {
    try {
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
      callback(error); // Just pass the error without the null filename
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
    upload.array("image", 10)(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "Files cannot be uploaded",
        });
      }

      // If no files were uploaded, create the PortfolioImage with a null value for the image
      if (!req.files || req.files.length === 0) {
        await PortfolioImage.create({
          image: null,
          portfolioId: req.params.portfolioId,
        });
        return res
          .status(201)
          .json({ msg: "Portfolio Image Created Successfully" });
      }

      const files = req.files.map((file) => file.filename);

      const portfolioimagePromises = files.map(async (file_name) => {
        await PortfolioImage.create({
          image: file_name,
          portfolioId: req.params.portfolioId,
        });
      });

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

    if (!portfolioimage) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      let file_name;

      if (req.file) {
        // Jika ada file yang diunggah, gunakan filename baru
        file_name = req.file.filename;
      } else if (portfolioimage.image) {
        // Jika tidak ada file yang diunggah dan ada filename sebelumnya, gunakan filename lama
        file_name = portfolioimage.image;
      } else {
        // Error handling jika tidak ada filename sama sekali (tidak ada file yang diunggah dan tidak ada filename sebelumnya)
        return res
          .status(400)
          .json({ msg: "No image provided and no previous image exists" });
      }

      if (req.params.portfolioId == portfolioimage.portfolioId) {
        if (req.file && portfolioimage.image) {
          // Hapus file lampiran lama dari direktori lokal hanya jika ada file baru dan ada file lama
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
            // Lanjutkan proses pembaruan
            updateImage(file_name);
          });
        } else {
          // Langsung lanjutkan proses pembaruan jika tidak ada file baru atau tidak ada file lama
          updateImage(file_name);
        }
      } else {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
    });

    function updateImage(filename) {
      PortfolioImage.update(
        { image: filename },
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
          res.status(200).json({ msg: "Portfolio image updated successfully" });
        })
        .catch((error) => {
          res.status(500).json({ msg: error.message });
        });
    }
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
      // If the portfolioimage has an image
      if (portfolioimage.image) {
        const imagePath = path.join(
          "src/image/portfolio_image",
          portfolioimage.image
        );

        fs.unlink(imagePath, async (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran" });
          }

          try {
            await PortfolioImage.destroy({
              where: {
                [Op.and]: [
                  { id: portfolioimage.id },
                  { portfolioId: req.params.portfolioId },
                ],
              },
            });
            res
              .status(200)
              .json({ msg: "Portfolio Image deleted successfully" });
          } catch (error) {
            console.error("Gagal menghapus data:", error);
            res.status(500).json({ msg: "Gagal menghapus data" });
          }
        });
      } else {
        // If portfolioimage doesn't have an image
        await PortfolioImage.destroy({
          where: {
            [Op.and]: [
              { id: portfolioimage.id },
              { portfolioId: req.params.portfolioId },
            ],
          },
        });
        res.status(200).json({ msg: "Portfolio Image entry deleted" });
      }
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
