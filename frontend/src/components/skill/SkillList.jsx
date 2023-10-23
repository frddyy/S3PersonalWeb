import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const SkillList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string

  const [skills, setSkills] = useState([]);
  const [identities, setIdentities] = useState([]);
  const [identityId, setIdentityId] = useState("");

  let isAdmin = false;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Call getMe to set the userId
    dispatch(getMe())
      .then((result) => {
        if (getMe.fulfilled.match(result)) {
          const user = result.payload;
          console.log("User:", user);
          console.log("UserID:", user.id);
          setUserId(user.id);
          setUserRole(user.role);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      getIdentities();
    }
  }, [userId]);

  if (userRole === "admin") {
    isAdmin = true;
  }

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

  const deleteSkills = async (skillId) => {
    await axios.delete(
      `http://localhost:5000/identities/${identityId}/skills/${skillId}`
    );
    getSkills();
  };

  // Define the columns for your DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "title",
      headerName: "Judul",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "thumbnail",
      headerName: "Thumbnail",
      flex: 2,
      cellClassName: "image-column--cell",
    },
    {
      field: "level",
      headerName: "Level",
      flex: 1,
      cellClassName: "level-column--cell",
    },
    {
      field: "identityId",
      headerName: "Identity ID",
      flex: 1,
      cellClassName: "identityId-column--cell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Link to={`/skills/edit/${row.id}`}>
              <Button
                sx={{
                  backgroundColor: colors.blueAccent[600],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px 10px",
                }}
              >
                <EditIcon />
              </Button>
            </Link>
            <Button
              onClick={() => deleteSkills(row.id)}
              sx={{
                backgroundColor: colors.redAccent[600],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "5px 10px",
              }}
            >
              <DeleteIcon />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="SKILLS" subtitle="Managing the Skill" />
      {isAdmin ? (
        <>
          <FormControl variant="filled" sx={{ mx: 2, minWidth: 300 }}>
            <InputLabel id="select-filled-label">Select User</InputLabel>
            <Select
              labelId="select-filled-label"
              id="select-filled"
              value={identityId}
              onChange={(e) => setIdentityId(e.target.value)}
              displayEmpty
              fullWidth
            >
              {identities.map((identity) => (
                <MenuItem key={identity.id} value={identity.id}>
                  {identity.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : null}

      <Link to="/skills/add">
        <Button
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Add New
        </Button>
      </Link>

      {skills.length === 0 ? (
        <Typography variant="body1" color="textSecondary" margin="10px">
          There are no skill available. Please add a new skill.
        </Typography>
      ) : (
        <Box
          m="40px 0 0 0"
          height="55vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
              overflowX: "auto", // Membuat tabel bisa digeser secara horizontal
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <div
            style={{
              overflowX: "auto", // Membuat tabel bisa digeser secara horizontal
            }}
          >
            <DataGrid checkboxSelection rows={skills} columns={columns} />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default SkillList;
