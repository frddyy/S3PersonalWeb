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

const EditPortfolioForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const { portfolioId } = useParams();

  const [portfolioData, setPortfolioData] = useState({
    title: "",
    description: "",
    attachment: null,
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
      getPortfolioById();
    }
  }, [userId, identities]);

  const getPortfolioById = async () => {
    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    console.log("match? ", matchingIdentity);

    if (matchingIdentity) {
      const identityIdForPortfolio = matchingIdentity.id;
      console.log("identityId: ", identityIdForPortfolio);

      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityIdForPortfolio}/portfolios/${portfolioId}`
        );
        const portfolioData = response.data;
        setPortfolioData(portfolioData || {});
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
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

  const updatePortfolio = async (e) => {
    e.preventDefault();

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForPortfolio = matchingIdentity.id;

      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        for (const key in portfolioData) {
          if (key === "image" && portfolioData[key] instanceof File) {
            // Append the file to the FormData
            formData.append(key, portfolioData[key]);
          } else if (portfolioData[key] !== "") {
            formData.append(key, portfolioData[key]);
          }
        }

        await axios.patch(
          `http://localhost:5000/identities/${identityIdForPortfolio}/portfolios/${portfolioId}`,
          formData
        );
        setMsg("Perubahan Portfolio Pengguna Berhasil");
        navigate("/portfolios");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Terjadi kesalahan saat memperbarui portfolio pengguna.");
        }
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Update the image field with the File object
      setPortfolioData({ ...portfolioData, [name]: files[0] || null });
    } else {
      setPortfolioData({ ...portfolioData, [name]: value });
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT PORTFOLIO" subtitle="Edit Portfolio" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <form onSubmit={(values) => updatePortfolio(values)}>
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
            value={portfolioData.title || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="description"
            name="description"
            label="Link Portfolio"
            value={portfolioData.description || ""}
            onChange={handleFieldChange}
            sx={{ gridColumn: "span 4" }}
          />
          {/* Field untuk Upload Image */}
          <Box sx={{ gridColumn: "span 4" }}>
            <Typography>Image</Typography>
            <TextField
              fullWidth
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFieldChange}
              disableUnderline="true"
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Edit Portfolio
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditPortfolioForm;
