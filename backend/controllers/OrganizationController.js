import Organization from "../models/OrganizationModel.js";
import path from 'path';
import multer from 'multer';

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/img/organization'); // Define the destination folder
  },
  filename: (req, file, callback) => {
    // Define the filename for the uploaded file
    const extensionName = path.extname(file.originalname);
    const filename = "organization_"+req.body.name_org + extensionName;
    callback(null, filename);
  },
});

const upload = multer({ storage: storage });

// Get all organization records
export const getOrganization = async (req, res) => {
  try {
    const response = await Organization.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getOrganizationByIdentityId = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const organizationData = await Organization.findAll({
      where: {
        identityId: identityId
      },
    });

    res.status(200).json(organizationData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get organization by organization_id and identity_id
export const getOrganizationByOrganizationIdAndIdentityId = async (req, res) => {
  try {
    const identityId = req.params.identityId;
    const organizationId = req.params.organizationId;

    const organizationData = await  Organization.findOne({
      where: {
        id: organizationId,
        identityId: identityId,
      },
    });

    if (!organizationData) {
      return res.status(404).json({ error: "Organization entry not found" });
    }

    res.status(200).json(organizationData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Create a new organization record
// export const createOrganization = async (req, res) => {
//   try {
//     const createdOrganization = await Organization.create(req.body);
//     res.status(200).json({ msg: "Organization created" });
//     res.status(201).json(createdOrganization);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createOrganization = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data tidak boleh kosong!"
      });
    }

    // Use the multer upload middleware to handle file uploads
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload"
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;

      // Rest of your code to upload to the database and send the response
      var data = {
        name_org: req.body.name_org,
        image: file_name,
        start_year: req.body.start_year,
        end_year: req.body.end_year,
        role: req.body.role,
        jobdesc: req.body.jobdesc
      };

      const createdOrganization = await Organization.create(data);
      res.status(201).json(createdOrganization);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an organization record by id
export const updateOrganization = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const organizationId = req.params.organizationId; // Assuming the organization_id is provided as a URL parameter

    const [updatedRowCount] = await Organization.update(req.body, {
      where: {
        id: organizationId,
        identityId: identityId,
      },
    });

    if (updatedRowCount === 0) {
      // No matching organization entry found
      return res.status(404).json({ error: "Organization entry not found" });
    }

    res.status(200).json({ msg: "Organization entry updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an organization record by id
export const deleteOrganization = async (req, res) => {
  try {
    const identityId = req.params.identityId; // Assuming the user_id is provided as a URL parameter
    const organizationId = req.params.organizationId; // Assuming the organization_id is provided as a URL parameter

    const deletedRowCount = await Organization.destroy({
      where: {
        id: organizationId,
        identityId: identityId,
      },
    });

    if (deletedRowCount === 0) {
      // No matching organization entry found
      return res.status(404).json({ error: "Organization entry not found" });
    }

    res.status(200).json({ msg: "Organization entry deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

