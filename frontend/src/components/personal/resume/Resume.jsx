import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../features/AuthSlice";
import "./resume.css";
import Data from "./Data";
import Card from "./Card";

const Resume = () => {
  const [educations, setEducations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
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
      getEducations();
      getOrganizations();
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

  const getEducations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/educations`
      );
      // Add a unique 'id' property to each user object
      const educationsWithIds = response.data.map((education) => ({
        ...education,
        id: education.id,
        identityId: identityId,
      }));
      setEducations(educationsWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getOrganizations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/identities/${identityId}/organizations`
      );
      // Add a unique 'id' property to each user object
      const organizationsWithIds = response.data.map((organization) => ({
        ...organization,
        id: organization.id,
        identityId: identityId,
      }));
      setOrganizations(organizationsWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="resume container section" id="resume">
      <h2 className="section__title">Experience</h2>

      <div className="resume__container grid">
        <div className="timeline grid">
          {educations.map((val, index) => {
            return (
              <Card
                key={index}
                icon="icon-graduation"
                title={val.name_sch}
                year={`${val.start_year} - ${val.end_year}`}
                desc={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${val.major} <br /> ${val.information}`,
                    }}
                  />
                }
              />
            );
          })}
        </div>

        <div className="timeline grid">
          {organizations.map((val, index) => {
            return (
              <Card
                key={index}
                icon="icon-briefcase"
                title={val.name_org}
                year={`${val.start_year} - ${val.end_year}`}
                desc={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${val.role} <br /> ${val.jobdesc}`,
                    }}
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Resume;
