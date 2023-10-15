import React, {useEffect} from "react";
import Layout from "../layout";
import EditSkillForm from "../../components/skill/EditSkillForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const EditSkill = () => {
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
    <Layout>
      <EditSkillForm/>
    </Layout>
  );
};

export default EditSkill;
