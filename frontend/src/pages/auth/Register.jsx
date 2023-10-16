import React, { useEffect } from "react";
import Layout from "../layout"
import SignUp from "../../components/auth/SignUp";
import Topbar from "../../components/global/Topbar";

const Register = () => {

  return (
    <Layout>
      <Topbar/>
      <SignUp/>
    </Layout>
  );
};

export default Register;
