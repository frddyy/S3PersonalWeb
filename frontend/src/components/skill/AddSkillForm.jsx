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
import { Formik, Field } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../header";
import { tokens } from "../../theme";
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const AddSkillForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string

  const [msg, setMsg] = useState("");
  const [identities, setIdentities] = useState([]);
  const [identityId, setIdentityId] = useState("");

  let isAdmin = false;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          console.log("User:", user);
          console.log("UserID:", user.id);
          setUserId(user.id);
          setUserRole(user.role);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, [dispatch]);

  console.log("User ID yg dah diset: ", userId);
  useEffect(() => {
    if (userId) {
      getIdentities();
    }
  }, [userId]);

  if (userRole === "admin") {
    isAdmin = true;
  }

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");

      if (!isAdmin && response.data.length > 0) {
        const userIdentity = response.data[0];
        console.log("INI IDENTITY ID: ", userIdentity.id);
        setIdentityId(userIdentity.id);
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("title is required"),
    // level: yup.string().required("level is required"),
  });
  console.log(`identityID: ${identityId}`);

  const saveSkill = async (values) => {
    console.log("savekSkill udah diklik", values);
    // if (!identityId) return;

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForSkill = matchingIdentity.id;
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("thumbnail", values.thumbnail);
      formData.append("level", values.level);

      try {
        await axios.post(
          `http://localhost:5000/identities/${identityIdForSkill}/skills`,
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
                helperText={touched.thumbnail && errors.thumbnail}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                select // Use 'select' for dropdown
                id="level"
                name="level"
                label="Level"
                value={values.level}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.level && Boolean(errors.level)}
                helperText={touched.level && errors.level}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </TextField>
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
