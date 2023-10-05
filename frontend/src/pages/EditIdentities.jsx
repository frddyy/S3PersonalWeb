import React, {useEffect} from "react";
import Layout from "./Layout";
import FormEditIdentity from "../components/FormEditIdentity";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlice";

const EditIdentity = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
  
    useEffect(() => {
      dispatch(getMe());
    }, [dispatch]);
  
    useEffect(() => {
      if (isError) {
        navigate("/");
      }
    }, [isError, navigate]);

  return (
    <Layout>
      <FormEditIdentity />
    </Layout>
  );
};

export default EditIdentity;
