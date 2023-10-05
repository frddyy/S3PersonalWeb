import Identity from "../models/IdentityModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import Multer from 'multer';

// Configure multer to specify where to store uploaded files and their names.
const storage = Multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/imag'); // Define the destination folder frontend
  },
  filename: (req, file, callback) => {
    // Define the filename for the uploaded file
    const extensionName = path.extname(file.originalname);
    const filename = req.body.title + extensionName;
    callback(null, filename);
  },
});

const upload = Multer({ storage: storage });

// Mendapatkan semua identitas
export const getIdentity = async (req, res) => {
  try {
    let response;
    if(req.role === "admin"){
      response = await Identity.findAll({
        include: [{
          model: User,
          attributes: ['username', 'role']
        }]
      });
    } else {
      response = await Identity.findAll({
        where : {
          userId : req.userId
        },
        include: [{
          model: User,
          attributes: ['username', 'role']
        }]
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Mendapatkan identitas berdasarkan user ID
export const getIdentityById = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    if (req.role === "admin" || identity.userId === req.userId) {
      response = await Identity.findOne({
        where: {
          id: identity.id
        },
        include: [{
          model: User,
          attributes: ['username', 'role']
        }]
      });
    } else {
      response = await Identity.findOne({
        where: {
          [Op.and] : [{id: identity.id}, {userId: req.userId }]
        },
        include: [{
          model: User,
          attributes: ['username', 'role']
        }]
      });
    }
    res.status(200).json(response); 
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};






// Create a new identity record
export const createIdentity = async (req, res) => {
  const {
    name, 
    image, 
    place_of_birth,
    date_of_birth,
    address,
    phone_number,
    email,
    description,
    instagram,
    linkedin,
    twitter,
    github
  } = req.body;

  try {
    // if (!req.body) { 
    //   return res.status(400).send({
    //   message: "Data tidak boleh kosong!"
    //   });
    // }

    // // Use the multer upload middleware to handle file uploads
    // upload.single('attachment')(req, res, async (err) => {
    //   if (err) {
    //     return res.status(500).send({
    //       message: "File cannot upload"
    //     });
    //   }
    // });

    //   // File upload was successful, now you can access req.file
    // const file_name = req.file.filename;
   
    await Identity.create({
      name: name, 
      // image: file_name,
      image: image, 
      place_of_birth: place_of_birth,
      date_of_birth: date_of_birth,
      address: address,
      phone_number: phone_number,
      email: email,
      description: description,
      instagram: instagram,
      linkedin: linkedin,
      twitter: twitter,
      github: github,
      userId: req.userId
    });
    res.status(201).json({msg: "Identity Created Successfully"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}


export const updateIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      name, 
      image, 
      place_of_birth,
      date_of_birth,
      address,
      phone_number,
      email,
      description,
      instagram,
      linkedin,
      twitter,
      github
    } = req.body;
    if (req.role === "admin" || identity.userId === req.userId) {
      await Identity.update({name, image, place_of_birth, date_of_birth, address,
      phone_number, email, description, instagram, linkedin, twitter, github}, {
        where: {
          id: identity.id
        }
      });
    } else {
      if(req.userId !== identity.userId) return res.status(403).json({msg: "Akses terlarang"});
      await Identity.update({name, image, place_of_birth, date_of_birth, address,
        phone_number, email, description, instagram, linkedin, twitter, github}, {
          where: {
            [Op.and] : [{id: identity.id}, {userId: req.userId }]
          }
        });
    }
    res.status(200).json({msg: "Identity updated succesfully"}); 
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const deleteIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!identity) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin" || identity.userId === req.userId) {
      await Identity.destroy({
        where: {
          id: identity.id
        }
      });
    } else {
      if(req.userId !== identity.userId) return res.status(403).json({msg: "Akses terlarang"});
      await Identity.destroy({
          where: {
            [Op.and] : [{id: identity.id}, {userId: req.userId }]
          }
        });
    }
    res.status(200).json({msg: "Identity deleted succesfully"}); 
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};