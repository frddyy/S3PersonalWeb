import Organization from "../models/OrganizationModel.js";

export const getOrganization = async(req, res) => {
    try {
        const response = await Organization.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}


export const getOrganizationById = async(req, res) => {
  try {
      const response = await Organization.findOne({
          where: {
              id: req.params.id
          }
      })
      res.status(200).json(response)
  } catch (error) {
      console.log(error.message)
  }
}

export const getOrganizationByIdentityId = async (req, res) => {
  try {
    const identityId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const identity = await Organization.findByPk(identityId);

    if (!identity) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const organizationRecords = await Organization.findAll({
      where: {
        identityId: identityId,
      },
    });

    res.status(200).json(organizationRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
