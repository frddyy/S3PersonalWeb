import React, {useEffect} from "react";
import Layout from "./Layout";
import FormAddIdentity from "../components/FormAddIdentitiy";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlice";

const AddIdentity = () => {
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
      <FormAddIdentity />
    </Layout>
  );
};

export default AddIdentity;
