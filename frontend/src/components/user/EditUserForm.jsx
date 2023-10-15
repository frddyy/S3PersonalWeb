import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";

const EditUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Get user data by userId and populate the form fields
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        const userData = response.data;
        setUserData(userData || {}); // Berikan nilai awal sebagai objek kosong jika userData null
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserById();
  }, [userId]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {};
      for (const key in userData) {
        if (userData[key] !== "") {
          updatedData[key] = userData[key];
        }
      }

      await axios.patch(`http://localhost:5000/users/${userId}`, updatedData);
      setMsg("Perubahan Pengguna Berhasil");
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat memperbarui pengguna.");
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Box m="20px">
      <Header title="EDIT USER" subtitle="Edit Akun Pengguna" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={updateUser}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns={isNonMobile ? "repeat(4, minmax(0, 1fr))" : "1fr"}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="username"
            name="username"
            label="Username"
            value={userData.username || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="password"
            id="password"
            name="password"
            label="Password"
            value={userData.password || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={userData.confirmPassword || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />

          <TextField
            id="filled-select-role"
            select
            label="Select Role"
            variant="filled"
            name="role"
            value={userData.role || ""}
            onChange={handleFieldChange}
            fullWidth
            sx={{ gridColumn: "span 4" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Box>

        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Update User
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditUserForm;
