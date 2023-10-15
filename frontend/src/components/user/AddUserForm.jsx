import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const AddUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");

  // Define the Yup validation schema
  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: yup.string().required("Role is required"),
  });

  const saveUser = async (values) => {
    try {
      await axios.post("http://localhost:5000/users", values);
      setMsg("Register Berhasil");
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat menyimpan pengguna.");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Account" />
      <Typography variant="h6" color="error">
        {msg}
      </Typography>
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          role: "",
        }}
        validationSchema={validationSchema}
        onSubmit={saveUser}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
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
                id="username"
                name="username"
                label="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.username && errors.username && (
                <Typography color="error">{errors.username}</Typography>
              )}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                id="password"
                name="password"
                label="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.password && errors.password && (
                <Typography color="error">{errors.password}</Typography>
              )}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Typography color="error">{errors.confirmPassword}</Typography>
              )}
              <TextField
                id="filled-select-role"
                select
                label="Select Role"
                variant="filled"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.role && errors.role}
                fullWidth
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
              {touched.role && errors.role && (
                <Typography color="error">{errors.role}</Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddUserForm;
