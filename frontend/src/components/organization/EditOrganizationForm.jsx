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

const EditOrganizationForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const { organizationId } = useParams();

  const [organizationData, setOrganizationData] = useState({
    name_org: "",
    image: null,
    start_year: "",
    end_year: "",
    role: "",
    jobdesc: "",
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
      getOrganizationById();
    }
  }, [userId, identities]);
  

  const getOrganizationById = async () => {
    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    console.log("match? ", matchingIdentity);

    if (matchingIdentity) {
      const identityIdForOrganization = matchingIdentity.id;
      console.log("identityId: ", identityIdForOrganization)

      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityIdForOrganization}/organizations/${organizationId}`
        );
        const organizationData = response.data;
        setOrganizationData(organizationData || {});
      } catch (error) {
        console.error("Error fetching organization data:", error);
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

  const updateOrganization = async (e) => {
    e.preventDefault();

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForOrganization = matchingIdentity.id;

      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        for (const key in organizationData) {
          if (key === "image" && organizationData[key] instanceof File) {
            // Append the file to the FormData
            formData.append(key, organizationData[key]);
          } else if (organizationData[key] !== "") {
            formData.append(key, organizationData[key]);
          }
        }

        await axios.patch(
          `http://localhost:5000/identities/${identityIdForOrganization}/organizations/${organizationId}`,
          formData
        );
        setMsg("Perubahan Organisasi Pengguna Berhasil");
        navigate("/organizations");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Terjadi kesalahan saat memperbarui organisasi pengguna.");
        }
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Update the image field with the File object
      setOrganizationData({ ...organizationData, [name]: files[0] || null });
    } else {
      setOrganizationData({ ...organizationData, [name]: value });
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT ORGANIZATION" subtitle="Edit Organization" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={(values) => updateOrganization(values)}>
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
            id="name_org"
            name="name_org"
            label="Organization Name"
            value={organizationData.name_org || ""}
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
            value={organizationData.start_year || ""}
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
            value={organizationData.end_year || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="role"
            name="role"
            label="Role"
            value={organizationData.role || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="jobdesc"
            name="jobdesc"
            label="Job Description"
            value={organizationData.jobdesc || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Edit Organization
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditOrganizationForm;
