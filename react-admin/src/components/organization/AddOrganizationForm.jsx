import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const AddOrganizationForm = () => {
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
    name_org: yup.string().required("Organization name is required"),
    image: yup.string().required("Image is required"),
    start_year: yup.string().required("Year start is required"),
    end_year: yup.string().required("Year end is required"),
    role: yup.string().required("Role is required"),
    jobdesc: yup.string().required("Jobdesc is required"),
  });

  // const saveOrganization = async (values) => {
  //   try {
  //     await axios.post("http://localhost:5000/identities/1/organizations", values);
  //     setMsg("Organization Saved!");
  //     navigate("/organizations");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       setMsg("Terjadi kesalahan saat menyimpan data organisasi.");
  //     }
  //   }
  // };

  const saveOrganization = async (values) => {
    if (!identityId) return;

    const formData = new FormData();
    formData.append("name_org", values.name_org);
    formData.append("image", values.image);
    formData.append("start_year", values.start_year);
    formData.append("end_year", values.end_year);
    formData.append("role", values.role);
    formData.append("jobdesc", values.jobdesc);

    try {
      await axios.post(
        `http://localhost:5000/identities/${identityId}/organizations`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg("Update Berhasil");
      navigate("/organizations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan data organisasi.");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE ORGANIZATION" subtitle="Create a New Organization Data" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          name_org: "",
          image: "",
          start_year: "",
          end_year: "",
          role: "",
          jobdesc: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => saveOrganization(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
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
                id="name_org"
                name="name_org"
                label="name_org"
                value={values.name_org}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name_org && errors.name_org} //nanti ganti pake skema error valdo
                sx={{ gridColumn: "span 4" }}
              />
              {touched.name_org && errors.name_org && (
                <Typography color="error">{errors.name_org}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="file"
                id="image"
                name="image"
                label="File"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
                // value={values.image}
                // onChange={handleChange}
                onBlur={handleBlur}
                error={touched.image && errors.image}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.image && errors.image && (
                <Typography color="error">{errors.image}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="start_year"
                name="start_year"
                label="start_year"
                value={values.start_year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.start_year && errors.start_year}
                sx={{ gridColumn: "span 2" }}
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
                label="end_year"
                value={values.end_year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.end_year && errors.end_year}
                sx={{ gridColumn: "span 2" }}
              />
              {touched.end_year && errors.end_year && (
                <Typography color="error">{errors.end_year}</Typography>
              )}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="role"
                name="role"
                label="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.role && errors.role && (
                <Typography color="error">{errors.role}</Typography>
              )}
 
              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="jobdesc"
                name="jobdesc"
                label="jobdesc"
                value={values.jobdesc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.jobdesc && errors.jobdesc}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.jobdesc && errors.jobdesc && (
                <Typography color="error">{errors.jobdesc}</Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Data
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOrganizationForm;
