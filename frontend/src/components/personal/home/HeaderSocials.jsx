import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../features/AuthSlice";

const HeaderSocials = () => {
  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

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
        setInstagram(userIdentity.instagram);
        setTwitter(userIdentity.twitter);
        setLinkedin(userIdentity.linkedin);
        setGithub(userIdentity.github);
      } else {
        // Handle the case when userIdentity is not found
        // You might want to set a default value or show a loading message.
        setInstagram("");
        setTwitter("");
        setLinkedin("");
        setGithub("");
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className="home__socials">
      <a href={instagram} className="home__social-link" target="_blank">
        <i className="fa-brands fa-instagram"></i>
      </a>

      <a
        href={twitter}
        className="home__social-link"
        target="_blank"
      >
        <i className="fa-brands fa-twitter"></i>
      </a>

      <a
        href={linkedin}
        className="home__social-link"
        target="_blank"
      >
        <i className="fa-brands fa-linkedin"></i>
      </a>

      <a
        href={github}
        className="home__social-link"
        target="_blank"
      >
        <i className="fa-brands fa-github"></i>
      </a>
    </div>
  );
};

export default HeaderSocials;
