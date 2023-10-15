import React, {useEffect} from "react";
import Bar from "../bar";
import AddIdentityForm from "../../components/identity/AddIdentityForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const AddIdentity = () => {
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
      }, [isError, user, navigate]);

  return (
    <Bar>
      <AddIdentityForm/>
    </Bar>
  );
};

export default AddIdentity;
