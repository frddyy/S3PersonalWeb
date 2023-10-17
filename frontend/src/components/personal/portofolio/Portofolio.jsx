import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../features/AuthSlice";
import "./portofolio.css";
import Menu from "./Menu";

const Portofolio = () => {
  const [items, setItems] = useState(Menu);
  const filterItem = (categoryItem) => {
    const updateItems = Menu.filter((curElem) => {
      return curElem.category === categoryItem;
    });

    setItems(updateItems);
  };

  const [portfolios, setPortfolios] = useState([]);
  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string

  const [identities, setIdentities] = useState([]);
  const [identityId, setIdentityId] = useState("");

  let isAdmin = false;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          // console.log("User:", user);
          // console.log("UserID:", user.id);
          setUserId(user.id);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      // Hanya akses userIdentity jika userId sudah diisi
      getIdentities();
    }
  }, [userId]);

  useEffect(() => {
    if (identityId !== "") {
      getPortfolios();
    }
  }, [identityId]);

  useEffect(() => {
    if (userId) {
      // For non-admin users, set the identityId based on their own identity
      if (!isAdmin && identities.length > 0) {
        setIdentityId(identities[0].id);
      }
    }
  }, [userId, isAdmin, identities]);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");

      if (!isAdmin && response.data.length > 0) {
        const userIdentity = response.data[0];
        setIdentityId(userIdentity.id);
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPortfolios = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/portfolios`
      );
      // Add a unique 'id' property to each user object
      const portfoliosWithIds = response.data.map((portfolio) => ({
        ...portfolio,
        id: portfolio.id,
        identityId: identityId,
      }));
      setPortfolios(portfoliosWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="work container section" id="work">
      <h2 className="section__title">Portfolios</h2>

      {/* <div className="work__filters">
        <span className="work__item" onClick={() => setItems(Menu)}>
          Everything
        </span>
        <span className="work__item" onClick={() => filterItem("Creative")}>
          Creative
        </span>
        <span className="work__item" onClick={() => filterItem("Art")}>
          Art
        </span>
        <span className="work__item" onClick={() => filterItem("Design")}>
          Design
        </span>
        <span className="work__item" onClick={() => filterItem("Branding")}>
          Branding
        </span>
      </div> */}

      <div className="work__container grid">
        {portfolios.map((elem) => {
          const {index, title, description, attachment } = elem;
          return (
            <div className="work__card" key={index}>
              <div className="work__thumnail">
                <img src={`http://localhost:5000/image/portfolio/` + attachment} alt="" className="work__img" />
                <div className="work__mask"></div>
              </div>

              {/* <span className="work__category">{category}</span> */}
              <h3 className="work__title">{title}</h3>
              <a href={description} className="work__button">
                <i className="icon-link work__button-icon"></i>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Portofolio;
