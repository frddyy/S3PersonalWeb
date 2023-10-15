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
import Header from "../header";
import { tokens } from "../../theme";
import { styled } from "@mui/material/styles";

const AddEducationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  // Define the Yup validation schema
  const validationSchema = yup.object().shape({
    name_sch: yup.string().required("name is required"),
    // image: yup.string().required("image is required"),
    start_year: yup.string().required("pob is required"),
    end_year: yup.date().required("pob is required"),
    major: yup.string().required("address is required"),
    information: yup.string().required("phone no is required"),
    // instagram : yup.string().required("instagram is required"),
    // linkedin : yup.string().required("linkedin is required"),
    // tw
  });

  const saveEducation = async (values) => {
    if (!identityId) return;

    const formData = new FormData();
    formData.append("name_sch", values.name_sch);
    formData.append("image", values.image);
    formData.append("start_year", values.start_year);
    formData.append("end_year", values.end_year);
    formData.append("major", values.major);
    formData.append("information", values.information);

    try {
      await axios.post(
        `http://localhost:5000/identities/${identityId}/educations`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg("Update Berhasil");
      navigate("/educations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan education.");
      }
    }
  };

  // const saveEducation = async (values) => {
  //   if (!identityId) return;

  //   try {
  //     await axios.post(
  //       `http://localhost:5000/identities/${identityId}/educations`,
  //       values
  //     );
  //     setMsg("Update Berhasil");
  //     navigate("/educations");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       setMsg("Terjadi kesalahan saat menyimpan portfolio.");
  //     }
  //   }
  // };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    // overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Box m="20px">
      <Header
        title="CREATE EDUCATION"
        subtitle="Create a New Education History"
      />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          name_sch: "",
          image: null,
          start_year: "",
          end_year: "",
          major: "",
          information: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => saveEducation(values)}
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
                error={touched.name_sch && errors.nam}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.name_sch && errors.name_sch && (
                <Typography color="error">{errors.name_sch}</Typography>
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
                id="start_year"
                name="start_year"
                label="Start Year"
                value={values.start_year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.start_year && errors.start_year}
                sx={{ gridColumn: "span 1" }}
              />
              {touched.start_year && errors.start_year && (
                <Typography color="error">{errors.start_year}</Typography>
              )}

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
                error={touched.end_year && errors.end_year}
                sx={{ gridColumn: "span 3" }}
              />
              {touched.end_year && errors.end_year && (
                <Typography color="error">{errors.end_year}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="major"
                name="major"
                label="major"
                value={values.major}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.major && errors.major}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
              {touched.major && errors.major && (
                <Typography color="error">{errors.major}</Typography>
              )}

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
                error={touched.information && errors.information}
                sx={{ gridColumn: "span 2" }}
              />
              {touched.information && errors.information && (
                <Typography color="error">{errors.information}</Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Education
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddEducationForm;
