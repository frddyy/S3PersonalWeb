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

const EditSkillForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [skillId, setSkillId] = useState("");

  const [initialFormValues, setInitialFormValues] = useState({
    title: "",
    thumbnail: "",
    level: "",
  });

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    if (identityId) {
      getSkills();
    }
  }, [identityId]);

  console.log("Identity ID:", identityId);
  console.log("Skill ID:", skillId);

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

  const getSkills = async () => {
    if (!identityId) return; // Ensure we have a valid identityId

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/skills`
      );
      if (response.data.length > 0) {
        const identitySkill = response.data[0];
        setSkillId(identitySkill.id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSkillById = async () => {
    if (!identityId || !skillId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/skills/${skillId}`
      );
      const { title, thumbnail, level } = response.data;
      // Update initial form values
      setInitialFormValues({ title, thumbnail, level });
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const updateSkill = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("thumbnail", values.thumbnail);
    if (values.attachment) {
      formData.append("level", values.level);
    }

    try {
      await axios.patch(
        `http://localhost:5000/identities/${identityId}/skills/${skillId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/skills");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE SKILL" subtitle="Update Skill" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik initialValues={initialFormValues} onSubmit={updateSkill}>
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
                label=""
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
                Update Skill
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditSkillForm;
