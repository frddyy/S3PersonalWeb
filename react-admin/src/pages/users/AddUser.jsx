import React, {useEffect} from "react";
import Layout from "../layout";
import AddUserForm from "../../components/user/AddUserForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
  
    useEffect(() => {
      dispatch(getMe());
    }, [dispatch]);
  
    useEffect(() => {
        if (isError) {
          navigate("/");
        }
        if (user && user.role !== "admin") {
          navigate("/dashboard");
        }
      }, [isError, user, navigate]);

  return (
    <Layout>
      <AddUserForm/>
    </Layout>
  );
};

export default AddUser;
