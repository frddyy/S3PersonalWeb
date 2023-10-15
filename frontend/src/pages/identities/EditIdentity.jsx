import React, {useEffect} from "react";
import Bar from "../bar";
import EditIdentityForm from "../../components/identity/EditIdentityForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const EditIdentity = () => {
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
        // if (user && user.role !== "admin") {
        //   navigate("/dashboard");
        // }
      }, [isError, user, navigate]);

  return (
    <Bar>
      <EditIdentityForm/>
    </Bar>
  );
};

export default EditIdentity;
