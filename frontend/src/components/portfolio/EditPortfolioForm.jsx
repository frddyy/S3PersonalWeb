import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const EditPortfolioForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [portfolioId, setPortfolioId] = useState("");

  const [initialFormValues, setInitialFormValues] = useState({
    title: "",
    description: "",
    attachment: "",
  });

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    getPortfolioById();
  }, []);

  useEffect(() => {
    if (identityId) {
      getPortfolios();
    }
  }, [identityId]);

  console.log("Identity ID:", identityId);
  console.log("Portfolio ID:", portfolioId);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      if (response.data.length > 0) {
        const userIdentity = response.data[0];
        setIdentityId(userIdentity.id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPortfolios = async () => {
    if (!identityId) return; // Ensure we have a valid identityId

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/portfolios`
      );
      if (response.data.length > 0) {
        const identityPortfolio = response.data[0];
        setPortfolioId(identityPortfolio.id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPortfolioById = async () => {
    if (!identityId || !portfolioId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/portfolios/${portfolioId}`
      );
      const { title, description, attachment } = response.data;
      // Update initial form values
      setInitialFormValues({ title, description, attachment });
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const updatePortfolio = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (values.attachment) {
      formData.append("attachment", values.attachment);
    }

    try {
      await axios.patch(
        `http://localhost:5000/identities/${identityId}/portfolios/${portfolioId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/portfolios");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE PORTFOLIO" subtitle="Update Portfolio" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik initialValues={initialFormValues} onSubmit={updatePortfolio}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
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
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="description"
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="file"
                id="attachment"
                name="attachment"
                label=""
                onChange={(event) => {
                  setFieldValue("attachment", event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                error={touched.attachment && Boolean(errors.attachment)}
                helperText={touched.attachment && errors.attachment}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Portfolio
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditPortfolioForm;
