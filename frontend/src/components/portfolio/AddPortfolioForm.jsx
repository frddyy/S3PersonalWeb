import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const AddPortfolioForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [identities, setIdentities] = useState([]);
  const [identityId, setIdentityId] = useState("");

  useEffect(() => {
    getIdentities();
  }, []);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      if (response.data.length > 0) {
        const userIdentity = response.data[0];
        setIdentityId(userIdentity.id);
      }
      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("title is required"),
    description: yup.string().required("description is required"),
    attachment: yup.mixed().required("file is required"),
  });

  //   const savePortfolio = async (values) => {
  //     if (!identityId) return;

  //     try {
  //       await axios.post(
  //         `http://localhost:5000/identities/${identityId}/portfolios`,
  //         values
  //       );
  //       setMsg("Update Berhasil");
  //       navigate("/portfolios");
  //     } catch (error) {
  //       if (error.response) {
  //         setMsg(error.response.data.msg);
  //       } else {
  //         setMsg("Terjadi kesalahan saat menyimpan portfolio.");
  //       }
  //     }
  //   };

  const savePortfolio = async (values) => {
    if (!identityId) return;

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("attachment", values.attachment);

    try {
      await axios.post(
        `http://localhost:5000/identities/${identityId}/portfolios`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg("Update Berhasil");
      navigate("/portfolios");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan portfolio.");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PORTFOLIO" subtitle="Create a New Portfolio" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          title: "",
          description: "",
          attachment: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => savePortfolio(values)}
      >
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
                label="File"
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
                Create New Portfolio
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddPortfolioForm;
