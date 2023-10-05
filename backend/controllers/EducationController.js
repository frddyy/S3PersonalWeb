import Education from "../models/EducationModel.js";
import path from "path";
import { Op } from "sequelize";
import multer from "multer";
import Identity from "../models/IdentityModel.js";

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/img/education"); // Define the destination folder
    },
    filename: (req, file, callback) => {
        // Define the filename for the uploaded file
        const extensionName = path.extname(file.originalname);
        const filename = "education_" + req.body.name_sch + extensionName;
        callback(null, filename);
    },
});

const upload = multer({ storage: storage });

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

        if (!education) return res.status(404).json({ msg: "data tidak ditemukan" });

        let response;
        response = await education.findOne({
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

// Create a new education record
export const createEducation = async (req, res) => {
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(500).send({
                    message: "file cannot upload",
                });
            }

            const file_name = req.file.filename;
            const { name_sch, start_year, end_year, major, information } = req.body;
            await Education.create({
                name_sch: name_sch,
                image: file_name,
                start_year: start_year,
                end_year: end_year,
                major: major,
                information: information,
                identityId: req.params.identityId,
            });
            res.status(201).json({ msg: "Education created" });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update an education record by education_id and identity_id
export const updateEducation = async (req, res) => {
    try {
        const education = await Education.findOne({
            where: {
                id: req.params.educationId,
            },
        });

        if (!education) return res.status(404).json({ msg: "data tidak ditemukan" });

        const { name_sch, image, start_year, end_year, major, information } = req.body;

        if (req.params.identityId == education.identityId) {
            await Education.update(
                { name_sch, image, start_year, end_year, major, information },
                {
                    where: {
                        [Op.and]: [{ id: education.id }, { identityId: req.params.identityId }],
                    },
                }
            );
        } else {
            return res.status(403).json({ msg: "akses terlarang" });
        }

        res.status(200).json({ msg: "Education entry updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an education record by education_id and identity_id
export const deleteEducation = async (req, res) => {
    try {
        const education = await Education.findOne({
            where: {
                id: req.params.educationId,
            },
        });

        if (!education) return res.status(404).json({ msg: "Data tidak ditemukan" });

        if (req.params.identityId == education.educationId) {
            await Education.destroy({
                where: {
                    [Op.and]: [{ id: education.id }, { identityId: req.params.identityId }],
                },
            });
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        res.status(200).json({ msg: "Education entry deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
