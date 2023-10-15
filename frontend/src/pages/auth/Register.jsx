import React, { useEffect } from "react";
import Layout from "../layout"
import SignUp from "../../components/auth/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const Register = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { isError } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(getMe());
  // }, [dispatch]);
  
  // useEffect(() => {
  //   if (isError) {
  //     // Jika terjadi kesalahan, biarkan pengguna di halaman Register.
  //     navigate("/register");
  //   }
  // }, [isError, navigate]);
  

  return (
    <Layout>
      <SignUp/>
    </Layout>
  );
};

export default Register;
