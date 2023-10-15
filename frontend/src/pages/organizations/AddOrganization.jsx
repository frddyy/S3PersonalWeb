import React, {useEffect} from "react";
import Bar from "../bar";
import AddOrganizationForm from "../../components/organization/AddOrganizationForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const AddOrganization = () => {
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
      <AddOrganizationForm/>
    </Bar>
  );
};

export default AddOrganization;
