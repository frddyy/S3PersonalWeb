import React, { useEffect } from "react";
import Layout from "../layout"
import SignIn from "../../components/auth/SignIn";
import Topbar from "../../components/global/Topbar";

const Login = () => {

  return (
    <Layout>
      <Topbar/>
      <SignIn/>
    </Layout>
  );
};

export default Login;
