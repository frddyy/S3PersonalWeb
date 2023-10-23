import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  useMediaQuery,
  InputLabel,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Formik, Field } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { tokens } from "../../theme";
import { styled } from "@mui/material/styles";
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const AddIdentityForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");

  const validationSchema = yup.object().shape({
    name: yup.string().required("Full Name is required"),
    phone_number: yup
      .string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Phone Number must be 10 digits"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
    image: yup
      .mixed()
      .test("fileFormat", "Invalid file format", (value) => {
        if (value) {
          const acceptedFormats = ["image/jpeg", "image/jpg", "image/png"];
          return acceptedFormats.includes(value.type);
        }
        return true;
      })
      .test("fileSize", "File is too large", (value) => {
        if (value) {
          return value.size <= 2 * 1024 * 1024; // 2MB in bytes
        }
        return true;
      }),
    place_of_birth: yup.string().required("Place of Birth is required"),
    date_of_birth: yup.date().required("Date of Birth is required"),
    address: yup.string().required("Address is required"),
    description: yup.string().required("Description is required"),
    // Validation for social media links
    instagram: yup.string().matches(
      /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/,
      "Invalid Instagram link"
    ),
    linkedin: yup.string().matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/,
      "Invalid LinkedIn link"
    ),
    twitter: yup.string().matches(
      /^(https?:\/\/)?(twitter\.com\/[a-zA-Z0-9_]+)$/,
      "Invalid Twitter link"
    ),
    github: yup.string().matches(
      /^(https?:\/\/)?(github\.com\/[a-zA-Z0-9_-]+)$/,
      "Invalid GitHub link"
    ),
  });
  

  const saveIdentity = async (values) => {
    try {
      await axios.post("http://localhost:5000/identities", values, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Register Berhasil");
      navigate("/identities");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan identitas pengguna.");
      }
    }
  };


  return (
    <Box m="20px">
      <Header title="CREATE PROFILE" subtitle="Create a New User Profile" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
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
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => saveIdentity(values)}
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
                id="name"
                name="name"
                label="Full Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.name && errors.name && (
                <Typography color="error">{errors.name}</Typography>
              )}
              {/* Field untuk Upload Image */}
              <Box sx={{ gridColumn: "span 4" }}>
                <Typography>Image</Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  type="file"
                  id="image"
                  name="image"
                  label=""
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  onBlur={handleBlur}
                  disableUnderline="true"
                  error={touched.image && errors.image}
                  sx={{ gridColumn: "span 4" }}
                />
                {touched.image && errors.image && (
                  <Typography color="error">{errors.image}</Typography>
                )}
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="place_of_birth"
                name="place_of_birth"
                label="Place of Birth"
                value={values.place_of_birth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.place_of_birth && errors.place_of_birth}
                sx={{ gridColumn: "span 1" }}
              />
              {touched.place_of_birth && errors.place_of_birth && (
                <Typography color="error">{errors.place_of_birth}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                label="Date of Birth"
                value={values.date_of_birth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.date_of_birth && errors.date_of_birth}
                sx={{ gridColumn: "span 3" }}
              />
              {touched.date_of_birth && errors.date_of_birth && (
                <Typography color="error">{errors.date_of_birth}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="address"
                name="address"
                label="Address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
              {touched.address && errors.address && (
                <Typography color="error">{errors.address}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="phone_number"
                name="phone_number"
                label="Phone Number"
                value={values.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: "span 2" }}
              />
              {touched.phone_number && errors.phone_number && (
                <Typography color="error">{errors.phone_number}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              {touched.email && errors.email && (
                <Typography color="error">{errors.email}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="textarea"
                id="description"
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
              {touched.description && errors.description && (
                <Typography color="error">{errors.description}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="instagram"
                name="instagram"
                label="Instagram"
                value={values.instagram}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.instagram && errors.instagram}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="linkedin"
                name="linkedin"
                label="Linkedin"
                value={values.linkedin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.linkedin && errors.linkedin}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="twitter"
                name="twitter"
                label="Twitter"
                value={values.twitter}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.twitter && errors.twitter}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="github"
                name="github"
                label="Github"
                value={values.github}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.github && errors.github}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Profile
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddIdentityForm;
