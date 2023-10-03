import Skill from "../models/SkillModel.js";
import Identity from "../models/IdentityModel.js";

export const getSkill = async (req, res) => {
    try {
        const response = await Skill.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const getSkillByIdentityId = async (req, res) => {
    try {
        const identityId = req.params.id; // Assuming you're getting the user ID from the request parameters

        // Find the user by their ID
        const identity = await Identity.findByPk(identityId);

        if (!identity) {
            return res.status(404).json({ message: "Skill not found" });
        }

        // Find education records associated with the user using the foreign key (user_id)
        const skillRecords = await Skill.findAll({
            where: {
                identityId: identityId,
            },
        });

        res.status(200).json(skillRecords);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createSkill = async (req, res) => {
    try {
        const createdSkill = await Skill.create(req.body);
        res.status(200).json({ msg: "Skill created" });
        res.status(201).json(createdSkill);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateSkill = async (req, res) => {
    try {
        console.log(req.params);
        const id = req.params.id;
        const identityId = req.params.identityId; // Merujuk ke identity_id

        const [updatedRowCount] = await Skill.update(
            { ...req.body, identityId: identityId },
            {
                where: {
                    id: id,
                    identityId: identityId,
                },
            }
        );

        if (updatedRowCount === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.status(200).json({ msg: "Skill entry updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const id = req.params.id;
        const identityId = req.params.identityId;

        // Menggunakan destroy untuk menghapus identitas berdasarkan kriteria
        const deletedRowCount = await Skill.destroy({
            where: {
                id: id,
                identityId: identityId,
            },
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.status(200).json({ msg: "Identity entry deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
