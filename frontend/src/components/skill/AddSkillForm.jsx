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

const AddSkillForm = () => {
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
    thumbnail: yup.mixed().required("file is required"),
    level: yup.string().required("level is required"),
  });
  console.log(`identityID: ${identityId}`);

  const saveSkill = async (values) => {
    console.log("savekSkill udah diklik", values);
    if (!identityId) return;

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("thumbnail", values.thumbnail);
    formData.append("level", values.level);

    try {
      await axios.post(
        `http://localhost:5000/identities/${identityId}/skills`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("savekSkill udah ada datanyak", values);
      setMsg("Update Berhasil");
      navigate("/skills");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        console.log("savekSkill udah ada datanyak", values);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan data skill.");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE SKILL" subtitle="Create a New Skill" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          title: "",
          thumbnail: "",
          level: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => saveSkill(values)}
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
                type="file"
                id="thumbnail"
                name="thumbnail"
                label="File"
                onChange={(event) => {
                  setFieldValue("thumbnail", event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                error={touched.thumbnail && Boolean(errors.thumbnail)}
                helperText={touched.thumbnail && errors.thumbnail}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                id="level"
                name="level"
                label="Level"
                value={values.level}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.level && Boolean(errors.level)}
                helperText={touched.level && errors.level}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Skill
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddSkillForm;
