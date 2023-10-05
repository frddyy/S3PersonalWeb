import Organization from "../models/OrganizationModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/image/organization"); // Define the destination folder
    },
    filename: (req, file, callback) => {
        // Define the filename for the uploaded file
        const extensionName = path.extname(file.originalname);
        const filename = "organization_" + req.body.name_org + extensionName;
        callback(null, filename);
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

        if (!organization) return res.status(404).json({ msg: "Data tidak ditemukan" });

        let response;
        response = await Organization.findOne({
            where: {
                [Op.and]: [{ id: organization.id }, { identityId: req.params.identityId }],
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

        if (!organization) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { name_org, image, start_year, end_year, role, jobdesc } = req.body;

        if (req.params.identityId == organization.identityId) {
            await Organization.update(
                { name_org, image, start_year, end_year, role, jobdesc },
                {
                    where: {
                        [Op.and]: [{ id: organization.id }, { identityId: req.params.identityId }],
                    },
                }
            );
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        res.status(200).json({ msg: "Organization updated successfully" });
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

        if (!organization) return res.status(404).json({ msg: "Data tidak ditemukan" });

        if (req.params.identityId == organization.identityId) {
            await Organization.destroy({
                where: {
                    [Op.and]: [{ id: organization.id }, { identityId: req.params.identityId }],
                },
            });
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        res.status(200).json({ msg: "Organization deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
