import Portfolio from "../models/PortfolioModel.js";
import Identity from "../models/IdentityModel.js";
import path from 'path';  
import {unlink} from 'fs';
import multer from 'multer';

// Configure multer to specify where to store uploaded files and their names.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/image/portfolio'); // Define the destination folder
  },
  filename: (req, file, callback) => {
    // Define the filename for the uploaded file
    const extensionName = path.extname(file.originalname);
    const filename = "portfolio_"+ req.body.title + extensionName;
    callback(null, filename);
  },
});

const upload = multer({ storage: storage });


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

export const createPortfolio = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data tidak boleh kosong!"
      });
    }

    // Use the multer upload middleware to handle file uploads
    upload.single('attachment')(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          message: "File cannot upload"
        });
      }

      // File upload was successful, now you can access req.file
      const file_name = req.file.filename;

      // Rest of your code to upload to the database and send the response
      var data = {
        title: req.body.title,
        description: req.body.description, // Correct the typo here
        attachment: file_name,
        identityId: req.body.identityId
      };

      const createdPortfolio = await Portfolio.create(data);
      res.status(201).json(createdPortfolio);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const { title, description } = req.body;

    // Check if the portfolio with the given ID exists
    const portfolio = await Portfolio.findByPk(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Update the portfolio's title and description
    portfolio.title = title;
    portfolio.description = description;

    // Save the updated portfolio to the database
    await portfolio.save();

    res.status(200).json({ message: 'Portfolio updated successfully', portfolio });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    // Find the portfolio by its ID
    const portfolio = await Portfolio.findByPk(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Delete the portfolio from the database
    await portfolio.destroy();

    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
