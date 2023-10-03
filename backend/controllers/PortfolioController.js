import Portfolio from "../models/PortfolioModel.js";
import Identity from "../models/IdentityModel.js";

export const getPortfolio = async(req, res) => {
    try {
        const response = await Portfolio.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getPortfolioByIdentityId = async (req, res) => {
  try {
    const identityId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const identity = await Identity.findByPk(userId);

    if (!identity) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const portfolioRecords = await Portfolio.findAll({
      where: {
        identityId: identityId,
      },
    });

    res.status(200).json(portfolioRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
