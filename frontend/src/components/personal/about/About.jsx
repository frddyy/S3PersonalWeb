import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../features/AuthSlice";
import "./about.css";
import Image from "../../../assets/avatar-2.svg";

const About = () => {
  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string
  const [name, setName] = useState("Loading..."); // Initialize with loading text
  const [profileImage, setProfileImage] = useState("");
  const [description, setDescription] = useState("");

  const [skills, setSkills] = useState([]);

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
      getSkills();
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

  const getSkills = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/skills`
      );
      // Add a unique 'id' property to each user object
      const skillsWithIds = response.data.map((skill) => ({
        ...skill,
        id: skill.id,
        identityId: identityId,
      }));
      setSkills(skillsWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      // console.log("Identities API response:", response.data);

      if (!isAdmin && response.data.length > 0) {
        const userIdentity = response.data[0];
        setIdentityId(userIdentity.id);
      }

      const userIdentity = response.data.find(
        (identity) => identity.userId === userId
      );
      // console.log(userIdentity);

      if (userIdentity) {
        setName(userIdentity.name);
        setProfileImage(userIdentity.image);
        setDescription(userIdentity.description);
      } else {
        // Handle the case when userIdentity is not found
        // You might want to set a default value or show a loading message.
        setName("");
        setProfileImage("");
        setDescription("");
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };


  const getSkillPercentage = (level) => {
    switch (level) {
      case "Beginner":
        return "20%";
      case "Intermediate":
        return "45%";
      case "Advanced":
        return "72%";
      case "Expert":
        return "99%";
      default:
        return "0%";
    }
  };

  function windowsPrint() {
    window.print();
  }
  

  return (
    <section className="about container section" id="about">
      <h2 className="section__title">About Me</h2>

      <div className="about__container grid">
        <img
          src={`http://localhost:5000/image/identity/` + profileImage}
          alt="profile-image"
          className="about__img"
          style={{ width: "200px", borderRadius: "100%" }}
        />

        <div className="about__data grid">
          <div className="about__info">
            <p className="about__description"> {description} </p>
            <a href="" className="btn" onClick={windowsPrint}>
              {" "}
              Download CV
            </a>
          </div>

          <div className="about__skills grid">
            {skills.map((skill, index) => (
              <div className="skills__data" key={skill.id}>
                <div className="skills__title">
                  <h3 className="skills_name">{skill.title}</h3>
                  <span className="skills__number">
                    {getSkillPercentage(skill.level)}
                  </span>
                </div>
                <div className="skills__bar">
                  <span
                    className="skills__percentage"
                    style={{ width: getSkillPercentage(skill.level) }}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
