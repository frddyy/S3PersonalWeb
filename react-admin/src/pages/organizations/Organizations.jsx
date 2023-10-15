import React, {useEffect} from 'react'
import Layout from '../layout'
import OrganizationList from '../../components/organization/OrganizationList'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const Organizations = () => {
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
        <OrganizationList/>
    </Layout>
  )
}

export default Organizations