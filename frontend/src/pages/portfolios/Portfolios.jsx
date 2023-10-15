import React, { useEffect } from "react";
import Bar from "../bar";
import PortfolioList from "../../components/portfolio/PortfolioList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlice";

const Portfolios = () => {
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
      <PortfolioList />
    </Bar>
  );
};

export default Portfolios;
