import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../features/AuthSlice";
import "./home.css";
import Me from "../../../assets/avatar-1.svg";
import HeaderSocials from "./HeaderSocials";
import ScrollDown from "./Scrolldown";
import Shapes from "./Shapes";

const Home = () => {
  const [name, setName] = useState("Loading..."); // Initialize with loading text
  const [profileImage, setProfileImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [role, setRole] = useState(""); // Initialize as an empty string
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [identities, setIdentities] = useState([]);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          // console.log("User:", user);
          // console.log("UserID:", user.id);
          setUserId(user.id);
          setRole(user.role);
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

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      // console.log("Identities API response:", response.data);

      const userIdentity = response.data.find(
        (identity) => identity.userId === userId
      );
      // console.log(userIdentity);

      if (userIdentity) {
        setName(userIdentity.name); // Update name state
        setProfileImage(userIdentity.image); // Update image state
        setPhoneNumber(userIdentity.phone_number);

      } else {
        // Handle the case when userIdentity is not found
        // You might want to set a default value or show a loading message.
        setName("User Not Found");
        setProfileImage("");
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <section className="home container" id="home">
      <div className="intro">
        <img
          src={`http://localhost:5000/image/identity/` + profileImage}
          alt="profile-image"
          className="home__img"
          style={{ width: "200px", borderRadius: "100%" }}
        />
        <h1 className="home__name">{name}</h1>
        {/* <span className="home__education">I'm Front End developer</span> */}

        <HeaderSocials />

        <a href={`http://wa.me/${phoneNumber}`} className="btn">
          Contact Me
        </a>

        <ScrollDown />
      </div>
      {/* <Shapes/> */}
    </section>
  );
};

export default Home;
