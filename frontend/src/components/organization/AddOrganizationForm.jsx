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
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const AddOrganizationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        console.log("INI IDENTITY ID: ",userIdentity.id);
        setIdentityId(userIdentity.id);
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Define the Yup validation schema
  const validationSchema = yup.object().shape({
    name_org: yup.string().required("Organization Name is required"),
    start_year: yup.string().required("Start Year is required"),
    end_year: yup.string().required("End Year is required"),
    role: yup.string().required("Role is required"),
    jobdesc: yup.string().required("Jobdesc is required"),
  });

  // const saveOrganization = async (values) => {
  //   console.log("saveOrganization function is called");
  //   console.log(identityId);

  //   if (!identityId) return;

  //   const formData = new FormData();
  //   formData.append("name_org", values.name_org);
  //   formData.append("image", values.image);
  //   formData.append("start_year", values.start_year);
  //   formData.append("end_year", values.end_year);
  //   formData.append("role", values.role);
  //   formData.append("jobdesc", values.jobdesc);

  //   try {
  //     await axios.post(
  //       `http://localhost:5000/identities/${identityId}/organizations`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setMsg("Update Berhasil");
  //     navigate("/organizations");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       setMsg("Terjadi kesalahan saat menyimpan organization.");
  //     }
  //   }
  // };

  const saveOrganization = async (values) => {
    console.log("udah diklik");
    console.log("identityId:", identityId)
    // if (!identityId) return;

    // Match the userId from the user object with an identity
    const matchingIdentity = identities.find(
      (identity) => identity.userId === userId
    );

    if (matchingIdentity) {
      const identityIdForOrganization = matchingIdentity.id;

      const formData = new FormData();
      formData.append("name_org", values.name_org);
      formData.append("image", values.image);
      formData.append("start_year", values.start_year);
      formData.append("end_year", values.end_year);
      formData.append("role", values.role);
      formData.append("jobdesc", values.jobdesc);

      try {
        await axios.post(
          `http://localhost:5000/identities/${identityIdForOrganization}/organizations`,
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
        console.log(error);
        setMsg(error.response.data.msg);
      }
    }
  };
  return (
    <Box m="20px">
      <Header
        title="CREATE ORGANIZATION"
        subtitle="Create a New Organization Data"
      />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          name_org: "",
          image: null,
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
                label="Organization Name"
                value={values.name_org}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name_org && errors.name_org}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.name_org && errors.name_org && (
                <Typography color="error">{errors.name_org}</Typography>
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
                  sx={{ gridColumn: "span 4" }}
                />
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
                multiline
                rows={4}
              />
              {touched.jobdesc && errors.jobdesc && (
                <Typography color="error">{errors.jobdesc}</Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add New Organization
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOrganizationForm;
