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
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";

const EditEducationForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [identities, setIdentities] = useState([]);
  const [educations, setEducation] = useState([]);
  const [identityId, setIdentityId] = useState("");
  const [educationId, setEducationId] = useState("");

  const [name_sch, setNameSch] = useState("");
  const [image, setImage] = useState("");
  const [start_year, setStartYear] = useState("");
  const [end_year, setEndYear] = useState("");
  const [major, setMajor] = useState("");
  const [information, setInformation] = useState("");

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    if (identityId) {
      getEducations();
    }
  }, [identityId]);

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

  const getEducations = async () => {
    if (!identityId) return; // Ensure we have a valid identityId

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/educations`
      );
      if (response.data.length > 0) {
        const identityEducation = response.data[0];
        setEducationId(identityEducation.id);
      }
      setEducation(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Get user data by userId and populate the form fields
    const getEducationById = async () => {
      if (!identityId || !educationId) return; // Ensure we have both valid identityId and portfolioId

      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${identityId}/educations/${educationId}`
        );
        setNameSch(response.data.name_sch);
        setImage(response.data.image);
        setStartYear(response.data.start_year);
        setEndYear(response.data.end_year);
        setMajor(response.data.major);
        setInformation(response.data.information);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    getEducationById();
  }, [id]);

  const updateEducation = async (values) => {
    const formData = new FormData();
    formData.append("name_sch", values.name_sch);
    if (values.image) {
      formData.append("image", values.image);
    }
    formData.append("start_year", values.start_year);
    formData.append("end_year", values.end_year);
    formData.append("major", values.major);
    formData.append("information", values.information);

    try {
      await axios.patch(
        `http://localhost:5000/identities/${identityId}/educations/${educationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/educations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT EDUCATION" subtitle="Edit Educations" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          name_sch: "",
          image: "",
          start_year: "",
          end_year: "",
          major: "",
          information: "",
        }}
        onSubmit={updateEducation}
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
                id="name_sch"
                name="name_sch"
                label="School Name"
                value={values.name_sch}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name_sch && Boolean(errors.name_sch)}
                helperText={touched.name_sch && errors.name_sch}
                sx={{ gridColumn: "span 4" }}
              />
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
                error={touched.image && Boolean(errors.image)}
                helperText={touched.image && errors.image}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="start_year"
                name="start_year"
                label="Start Year"
                value={values.start_year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.start_year && Boolean(errors.start_year)}
                helperText={touched.start_year && errors.start_year}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="end_year"
                name="end_year"
                label="End Year"
                value={values.end_year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.end_year && Boolean(errors.end_year)}
                helperText={touched.end_year && errors.end_year}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="major"
                name="major"
                label="Major"
                value={values.major}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.major && Boolean(errors.major)}
                helperText={touched.major && errors.major}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="information"
                name="information"
                label="Information"
                value={values.information}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.information && Boolean(errors.information)}
                helperText={touched.information && errors.information}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                edit education
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditEducationForm;
