import React, { useEffect } from "react";
import Bar from "../bar";
import EditPortfolioForm from "../../components/portfolio/EditPortfolioForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const EditPortfolio = () => {
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
    <Bar>
      <EditPortfolioForm />
    </Bar>
  );
};

export default EditPortfolio;
