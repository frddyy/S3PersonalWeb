import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import { tokens } from "../../theme";
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const EditEducationForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const { educationId } = useParams();

  const [educationData, setEducationData] = useState({
    name_sch: "",
    image: null,
    start_year: "",
    end_year: "",
    major: "",
    information: "",
  });

  const [msg, setMsg] = useState("");

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string

  const [identities, setIdentities] = useState([]);
  const [identityId, setIdentityId] = useState("");

  let isAdmin = false;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          console.log("User:", user);
          console.log("UserID:", user.id);
          setUserId(user.id);
          setUserRole(user.role);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (userId && identities.length > 0) {
      getEducationById();
    }
  }, [userId, identities]);
  

  const getEducationById = async () => {
    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    console.log("match? ", matchingIdentity);

    if (matchingIdentity) {
      const identityIdForEducation = matchingIdentity.id;
      console.log("identityId: ", identityIdForEducation)

      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityIdForEducation}/educations/${educationId}`
        );
        const educationData = response.data;
        setEducationData(educationData || {});
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }
    
  };

  useEffect(() => {
    if (userId) {
      getIdentities();
    }
  }, [userId]);

  if (userRole === "admin") {
    isAdmin = true;
  }

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");

      if (!isAdmin && response.data.length > 0) {
        const userIdentity = response.data[0];
        console.log("INI IDENTITY ID: ", userIdentity.id);
        setIdentityId(userIdentity.id);
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateEducation = async (e) => {
    e.preventDefault();

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForEducation = matchingIdentity.id;

      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        for (const key in educationData) {
          if (key === "image" && educationData[key] instanceof File) {
            // Append the file to the FormData
            formData.append(key, educationData[key]);
          } else if (educationData[key] !== "") {
            formData.append(key, educationData[key]);
          }
        }

        await axios.patch(
          `http://localhost:5000/identities/${identityIdForEducation}/educations/${educationId}`,
          formData
        );
        setMsg("Perubahan Pendidikan Pengguna Berhasil");
        navigate("/educations");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Terjadi kesalahan saat memperbarui pendidikan pengguna.");
        }
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Update the image field with the File object
      setEducationData({ ...educationData, [name]: files[0] || null });
    } else {
      setEducationData({ ...educationData, [name]: value });
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT EDUCATION" subtitle="Edit Educations" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={(values) => updateEducation(values)}>
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
            id="name_sch"
            name="name_sch"
            label="School Name"
            value={educationData.name_sch || ""}
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
            id="start_year"
            name="start_year"
            label="Start Year"
            value={educationData.start_year || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="end_year"
            name="end_year"
            label="End Year"
            value={educationData.end_year || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="major"
            name="major"
            label="Major"
            value={educationData.major || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="information"
            name="information"
            label="Information"
            value={educationData.information || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Edit Education
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditEducationForm;
