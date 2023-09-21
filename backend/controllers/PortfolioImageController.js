import Portfolio from "../models/PortfolioModel.js";
import PortfolioImage from "../models/PortfolioImageModel.js";

export const getPortfolioImage = async(req, res) => {
    try {
        const response = await PortfolioImage.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getPortfolioImageByPortfolioId = async (req, res) => {
  try {
    const portfolioId = req.params.id; // Assuming you're getting the user ID from the request parameters

    // Find the user by their ID
    const portfolio = await Portfolio.findByPk(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio Image not found' });
    }

    // Find education records associated with the user using the foreign key (user_id)
    const portfolioImageRecords = await PortfolioImage.findAll({
      where: {
        portfolio_id: portfolioId,
      },
    });

    res.status(200).json(portfolioImageRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
