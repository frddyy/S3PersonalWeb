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

const EditOrganizationForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  const [initialFormValues, setInitialFormValues] = useState({
    name_org: "",
    image: "",
    start_year: "",
    end_year: "",
    role: "",
    jobdesc: "",
  });

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    if (identityId) {
      getOrganizations();
    }
  }, [identityId]);

  console.log("Identity ID:", identityId);
  console.log("Organization ID:", organizationId);

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

  const getOrganizations = async () => {
    if (!identityId) return; // Ensure we have a valid identityId

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/organizations`
      );
      if (response.data.length > 0) {
        const identityOrganization = response.data[0];
        setOrganizationId(identityOrganization.id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getOrganizationyId = async () => {
    if (!identityId || !organizationId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/organizations/${organizationId}`
      );
      const { name_org, image, start_year, end_year, role, jobdesc } = response.data;
      // Update initial form values
      setInitialFormValues({ name_org, image, start_year, end_year, role, jobdesc});
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const updateOrganization = async (values) => {
    const formData = new FormData();
    formData.append("name_org", values.name_org);
    formData.append("start_year", values.start_year);
    formData.append("end_year", values.end_year);
    formData.append("role", values.role);
    formData.append("jobdesc", values.jobdesc);
    if (values.attachment) {
      formData.append("image", values.image);
    }

    try {
      await axios.patch(
        `http://localhost:5000/identities/${identityId}/organizations/${organizationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/organizations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE ORGANIZATION" subtitle="Update Organization" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik initialValues={initialFormValues} onSubmit={updateOrganization}>
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
                id="name_org"
                name="name_org"
                label="name_org"
                value={values.name_org}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name_org && Boolean(errors.name_org)}
                helperText={touched.name_org && errors.name_org}
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
                label="start_year"
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
                label="end_year"
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
                id="role"
                name="role"
                label="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.role && Boolean(errors.role)}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              />

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
                error={touched.jobdesc && Boolean(errors.jobdesc)}
                helperText={touched.jobdesc && errors.jobdesc}
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

export default EditOrganizationForm;
