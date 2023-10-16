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

const createUpload = multer({ storage: storage });

const updateStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/image/organization");
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

      const organization = await Organization.findOne({
        where: {
          id: req.params.organizationId,
        },
      });
      if (!organization) {
        throw new Error("organization not found");
      }

      const extensionName = path.extname(file.originalname);
      const orgName = req.body.name_org || organization.name_org;
      const filename = `${identity.name}_organization_${orgName}${extensionName}`;

      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

const updateUpload = multer({ storage: updateStorage });

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
    createUpload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }

      const { name_org, start_year, end_year, role, jobdesc } = req.body;
      let file_name = null; // Default to null for image
      if (req.file) {
        file_name = req.file.filename;
      }
      await Organization.create({
        name_org,
        image: file_name,
        start_year,
        end_year,
        role,
        jobdesc,
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

    updateUpload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload",
        });
      }
      let file_name = organization.image; // Default to the old image

      if (req.file) {
        // If there's a new uploaded image
        if (organization.image) {
          // Check if the old image exists
          // Remove the old image file
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
          });
        }
        file_name = req.file.filename; // Update to the new image
      }

      const orgName = req.body.name_org || organization.name_org;
      const { start_year, end_year, role, jobdesc } = req.body;

      if (req.params.identityId == organization.identityId) {
        await Organization.update(
          {
            name_org: orgName,
            image: file_name,
            start_year,
            end_year,
            role,
            jobdesc,
          },
          {
            where: {
              [Op.and]: [
                { id: organization.id },
                { identityId: req.params.identityId },
              ],
            },
          }
        );
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

    if (!organization) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    if (req.params.identityId == organization.identityId) {
      // Jika organization memiliki image
      if (organization.image) {
        const imagePath = path.join(
          "src/image/organization",
          organization.image
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus file lampiran:", err);
            return res
              .status(500)
              .json({ msg: "Gagal menghapus file lampiran" });
          }

          Organization.destroy({
            where: {
              [Op.and]: [
                { id: organization.id },
                { identityId: req.params.identityId },
              ],
            },
          }).then(() => {
            res.status(200).json({ msg: "Organization deleted successfully" });
          });
        });
      } else {
        // Jika organization tidak memiliki image
        await Organization.destroy({
          where: {
            [Op.and]: [
              { id: organization.id },
              { identityId: req.params.identityId },
            ],
          },
        });
        res.status(200).json({ msg: "Organization deleted successfully" });
      }
    } else {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
