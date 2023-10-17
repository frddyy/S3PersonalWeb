import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
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

const EditSkillForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const { skillId } = useParams();

  const [skillData, setSkillData] = useState({
    title: "",
    thumbnail: null,
    level: "",
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
      getSkillById();
    }
  }, [userId, identities]);

  const getSkillById = async () => {
    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    console.log("match? ", matchingIdentity);

    if (matchingIdentity) {
      const identityIdForSkill = matchingIdentity.id;
      console.log("identityId: ", identityIdForSkill);

      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityIdForSkill}/skills/${skillId}`
        );
        const skillData = response.data;
        setSkillData(skillData || {});
      } catch (error) {
        console.error("Error fetching skill data:", error);
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

  const updateSkill = async (e) => {
    e.preventDefault();

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForSkill = matchingIdentity.id;

      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        for (const key in skillData) {
          if (key === "image" && skillData[key] instanceof File) {
            // Append the file to the FormData
            formData.append(key, skillData[key]);
          } else if (skillData[key] !== "") {
            formData.append(key, skillData[key]);
          }
        }

        await axios.patch(
          `http://localhost:5000/identities/${identityIdForSkill}/skills/${skillId}`,
          formData
        );
        setMsg("Perubahan Skill Pengguna Berhasil");
        navigate("/skills");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Terjadi kesalahan saat memperbarui skill pengguna.");
        }
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Update the image field with the File object
      setSkillData({ ...skillData, [name]: files[0] || null });
    } else {
      setSkillData({ ...skillData, [name]: value });
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT SKILL" subtitle="Edit Skill" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={(values) => updateSkill(values)}>
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
            id="title"
            name="title"
            label="Title"
            value={skillData.title || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />
          {/* Field untuk Upload Image */}
          <Box sx={{ gridColumn: "span 4" }}>
            <Typography>Thumbnail</Typography>
            <TextField
              fullWidth
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFieldChange}
              disableUnderline="true"
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <TextField
            fullWidth
            variant="filled"
            select // Use 'select' for dropdown
            id="level"
            name="level"
            label="Level"
            value={skillData.level || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </TextField>
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Edit Skill
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditSkillForm;
