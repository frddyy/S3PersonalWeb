import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";

import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";

// import Image from "../../../../backend/src/image/identity"
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset, getMe } from "../../features/AuthSlice";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [name, setName] = useState("Loading..."); // Initialize with loading text
  // const [image, setImage] = useState(""); // Initialize as an empty string
  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [role, setRole] = useState(""); // Initialize as an empty string

  const [profileImage, setProfileImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const [identities, setIdentities] = useState([]);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          console.log("User:", user);
          console.log("UserID:", user.id);
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

  // useEffect(() => {
  //   axios.get('http://localhost:3000/')
  //   .then(res => {
  //     setProfileImage(res.profileImage[0])
  //   })
  //   .catch(err => console.log(err));
  // }, []);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      console.log("Identities API response:", response.data);

      const userIdentity = response.data.find(
        (identity) => identity.userId === userId
      );
      console.log(userIdentity);

      if (userIdentity) {
        setName(userIdentity.name); // Update name state
        setProfileImage(userIdentity.image); // Update image state
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
    <Box
      sx={{
        "& .pro-sidebar-layout": {
          height: "100%",
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  SISIPIAN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`http://localhost:5000/image/identity/` + profileImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {role.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {user && user.role === "admin" && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Data
              </Typography>
            )}

            {user && user.role === "admin" && (
              <Item
                title="Manage User"
                to="/users"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile"
              to="/identities"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Education"
              to="/educations"
              icon={<SchoolOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Organization"
              to="/organizations"
              icon={<CorporateFareOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Portfolio"
              to="/portfolios"
              icon={<CasesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Skill"
              to="/skills"
              icon={<VerifiedOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Landing Page"
              to="/landing"
              icon={<FlightLandOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
