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
import * as yup from "yup"; // Import Yup for validation
import { Formik } from "formik";


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
        setIdentityData(identityData);
      } catch (error) {
        console.error("Error fetching identity data:", error);
      }
    };

    console.log(identityData)

    getIdentityById();
  }, [identityId]);

    // Define the Yup validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Full Name is required"),
    phone_number: yup
      .string()
      .matches(
        /^\d{10}$/,
        "Phone Number must be a 10-digit numeric value"
      ),
    email: yup.string().email("Email must be a valid email address"),
    instagram: yup.string().url("Instagram must be a valid URL"),
    linkedin: yup.string().url("Linkedin must be a valid URL"),
    twitter: yup.string().url("Twitter must be a valid URL"),
    github: yup.string().url("Github must be a valid URL"),
    image: yup
      .mixed()
      .test("fileFormat", "Invalid file format", (value) => {
        if (value) {
          return value && value.type.startsWith("image/");
        }
        return true; // Allow empty field
      }),
  });


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
      <Formik
       initialValues={{
        name: identityData.name,
        image: identityData.image,
        place_of_birth: identityData.place_of_birth,
        date_of_birth: identityData.date_of_birth,
        address: identityData.address,
        phone_number: identityData.phone_number,
        email: identityData.email,
        description: identityData.description,
        instagram: identityData.instagram,
        linkedin: identityData.linkedin,
        twitter: identityData.twitter,
        github: identityData.github,
      }}
        validationSchema={validationSchema}
        onSubmit={updateIdentity}
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
                sx={{ gridColumn: "span 2" }}
              />
              {touched.name && errors.name && (
                <Typography color="error">{errors.name}</Typography>)
              }

              <Box sx={{ gridColumn: "span 4" }}>
                <Typography>Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
              </Box>

              {values.image && (
                <Typography>{values.image.name}</Typography>
              )}
              {touched.image && errors.image && (
                <Typography color="error">{errors.image}</Typography>)
              }

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
                sx={{ gridColumn: "span 2" }}
              />
              {touched.phone_number && errors.phone_number && (
                <Typography color="error">{errors.phone_number}</Typography>)
              }

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
                sx={{ gridColumn: "span 2" }}
              />
              {touched.email && errors.email && (
                <Typography color="error">{errors.email}</Typography>)
              }

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
                sx={{ gridColumn: "span 2" }}
              />
              {touched.instagram && errors.instagram && (
                <Typography color="error">{errors.instagram}</Typography>)
              }

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
                sx={{ gridColumn: "span 2" }}
              />
              {touched.linkedin && errors.linkedin && (
                <Typography color="error">{errors.linkedin}</Typography>)
              }

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="twitter"
                name="twitter"
                label ="Twitter"
                value={values.twitter}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ gridColumn: "span 2" }}
              />

              {touched.twitter && errors.twitter && (
                <Typography color="error">{errors.twitter}</Typography>)
              }

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="github"
                name= "github"
                label="Github"
                value={values.github}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ gridColumn: "span 2" }}
              />
              {touched.github && errors.github && (
                <Typography color="error">{errors.github}</Typography>)
              }

              
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Edit Profile
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditIdentityForm;
