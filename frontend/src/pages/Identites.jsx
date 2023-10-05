import React, {useEffect} from 'react'
import Layout from './Layout'
import IdentityList from '../components/IdentityList'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlice";

const Identites = () => {
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
        <IdentityList/>
    </Layout>
  )
}

export default Identites