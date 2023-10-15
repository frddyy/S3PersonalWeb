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

const EditIdentityForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { identityId } = useParams();

  const [identityData, setIdentityData] = useState({
    name: "",
    image: null,
    place_of_birth: "",
    date_of_birth: "",
    address: "",
    phone_number: "",
    email: "",
    description: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    github: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getIdentityById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityId}`
        );
        const identityData = response.data;
        setIdentityData(identityData || {});
      } catch (error) {
        console.error("Error fetching identity data:", error);
      }
    };

    getIdentityById();
  }, [identityId]);

  const updateIdentity = async (e) => {
    e.preventDefault();
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      for (const key in identityData) {
        if (key === "image" && identityData[key] instanceof File) {
          // Append the file to the FormData
          formData.append(key, identityData[key]);
        } else if (identityData[key] !== "") {
          formData.append(key, identityData[key]);
        }
      }

      await axios.patch(
        `http://localhost:5000/identities/${identityId}`,
        formData
      );
      setMsg("Perubahan Profil Pengguna Berhasil");
      navigate("/identities");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat memperbarui profil pengguna.");
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Update the image field with the File object
      setIdentityData({ ...identityData, [name]: files[0] || null });
    } else {
      setIdentityData({ ...identityData, [name]: value });
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT PROFILE" subtitle="Edit an User Profile" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={(values) => updateIdentity(values)}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns={
            isNonMobile ? "repeat(4, minmax(0, 1fr))" : "1fr"
          }
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="name"
            name="name"
            label="Full Name"
            value={identityData.name || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />
          {/* Field untuk Upload Image */}
          <Box sx={{ gridColumn: "span 4" }}>
            <Typography>Image</Typography>
            <TextField
              fullWidth
              type="file"
              id="image"
              name="image"
              onChange={handleFieldChange}
              disableUnderline="true"
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="place_of_birth"
            name="place_of_birth"
            label="Place of Birth"
            value={identityData.place_of_birth || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="date_of_birth"
            name="date_of_birth"
            label="Date of Birth"
            value={identityData.date_of_birth || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 3" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="address"
            name="address"
            label="Address"
            value={identityData.address || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="phone_number"
            name="phone_number"
            label="Phone Number"
            value={identityData.phone_number || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="email"
            name="email"
            label="Email"
            value={identityData.email || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="textarea"
            id="description"
            name="description"
            label="Description"
            value={identityData.description || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="instagram"
            name="instagram"
            label="Instagram"
            value={identityData.instagram || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="linkedin"
            name="linkedin"
            label="Linkedin"
            value={identityData.linkedin || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="twitter"
            name="twitter"
            label="Twitter"
            value={identityData.twitter || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="github"
            name="github"
            label="Github"
            value={identityData.github || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>

        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Edit Profile
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditIdentityForm;
