import Organization from "../models/OrganizationModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";
import fs from "fs";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/organization"); // Define the destination folder
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
      const filename = `${identity.name}_organization_${req.body.name_org}${extensionName}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const upload = multer({ storage: storage });

export const getOrganization = async (req, res) => {
  try {
    let response = await Organization.findAll({
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

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: {
        id: req.params.organizationId,
      },
    });

    if (!organization)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    response = await Organization.findOne({
      where: {
        [Op.and]: [
          { id: organization.id },
          { identityId: req.params.identityId },
        ],
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

export const createOrganization = async (req, res) => {
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
      const { name_org, start_year, end_year, role, jobdesc } = req.body;
      await Organization.create({
        name_org: name_org,
        image: file_name,
        start_year: start_year,
        end_year: end_year,
        role: role,
        jobdesc: jobdesc,
        identityId: req.params.identityId,
      });
      res.status(201).json({ msg: "Organization Created Successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: {
        id: req.params.organizationId,
      },
    });

    if (!organization)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      const file_name = req.file.filename;
      const { name_org, start_year, end_year, role, jobdesc } = req.body;

      if (req.params.identityId == organization.identityId) {
        // Hapus file lampiran lama dari direktori lokal
        const oldImagePath = path.join(
          "src/image/organization",
          organization.image
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran lama:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran lama" });
          }

          // Update data portofolio dengan file lampiran yang baru
          Organization.update(
            { name_org, image: file_name, start_year, end_year, role, jobdesc },
            {
              where: {
                [Op.and]: [
                  { id: organization.id },
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

export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: {
        id: req.params.organizationId,
      },
    });

    if (!organization)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.params.identityId == organization.identityId) {
      // Hapus file lampiran dari direktori lokal
      const imagePath = path.join("src/image/organization", organization.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file lampiran:", err);
          return res.status(500).json({ msg: "Gagal menghapus file lampiran" });
        }

        Organization.destroy({
          where: {
            [Op.and]: [
              { id: organization.id },
              { identityId: req.params.identityId },
            ],
          },
        });
      });
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }

    res.status(200).json({ msg: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
