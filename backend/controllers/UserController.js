import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "username", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "username", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Tidak Cocok" });

  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      username: username,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// export const updateUser = async (req, res) => {
//   const user = await User.findOne({
//     where: {
//         uuid: req.params.id
//     }
//   });
//   if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
//   const {username, password, confirmPassword, role} = req.body;
//   let hashPassword;
//   if(password === "" || password === null) {
//     hashPassword = user.password
//   } else {
//     hashPassword = await argon2.hash(password);
//   }
//   if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Confirm Password Tidak Cocok"});
//   try {
//     await User.update({
//       username: username,
//       password: hashPassword,
//       role: role
//     },{
//       where: {
//         id: user.id
//       }
//     });
//     res.status(200).json({msg: "User Updated"});
//   } catch (error) {
//     res.status(400).json({msg: error.message});
//   }
// };

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { username, password, confirmPassword, role } = req.body;
  let hashPassword = user.password; // Default menggunakan password yang ada

  if (password && password !== "") {
    // Periksa apakah password tidak kosong
    hashPassword = await argon2.hash(password); // Gunakan argon2.hash hanya jika password ada
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Tidak Cocok" });
  }

  try {
    await User.update(
      {
        username: username,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
