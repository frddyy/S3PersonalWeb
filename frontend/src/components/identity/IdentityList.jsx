import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getMe } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const IdentityList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [identities, setIdentities] = useState([]);
  const [msg, setMsg] = useState("");

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [userRole, setUserRole] = useState(""); // Initialize as an empty string

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
    // Always fetch identities after getting userId
    getIdentities();
  }, [userId]);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      // Add a unique 'id' property to each user object
      const identitiesWithIds = response.data.map((identity) => ({
        ...identity,
        id: identity.id, // Assuming 'uuid' is unique for each user
      }));
      setIdentities(identitiesWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteIdentities = async (identityId) => {
    await axios.delete(`http://localhost:5000/identities/${identityId}`);
    getIdentities();
  };

  // Define the columns for your DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Full Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      cellClassName: "image-column--cell",
    },
    {
      field: "place_of_birth",
      headerName: "Place of Birth",
      flex: 1,
      cellClassName: "pob-column--cell",
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      flex: 1,
      cellClassName: "dob-column--cell",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      cellClassName: "address-column--cell",
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      cellClassName: "phoneNo-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "email-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellClassName: "description-column--cell",
    },
    {
      field: "instagram",
      headerName: "Instagram",
      flex: 1,
      cellClassName: "instagram-column--cell",
    },
    {
      field: "linkedin",
      headerName: "Linkedin",
      flex: 1,
      cellClassName: "linkedin-column--cell",
    },
    {
      field: "twitter",
      headerName: "Twitter",
      flex: 1,
      cellClassName: "twitter-column--cell",
    },
    {
      field: "github",
      headerName: "Github",
      flex: 1,
      cellClassName: "github-column--cell",
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
      cellClassName: "userId-column--cell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: ({ row }) => {
        // Destructure 'row' from the argument
        return (
          <Box
            sx={{
              display: "flex",
              "& > *": {
                m: 1,
              },
            }}
          >
            <ButtonGroup
              sx={{
                m: "12px 12px 0 0",
                padding: "2px 2px",
              }}
              size="small"
              variant="contained"
              aria-label="outlined button group"
            >
              <Link to={`/identities/edit/${row.id}`}>
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
                onClick={() => deleteIdentities(row.id)}
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
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="IDENTITIES" subtitle="Managing the User Identity" />
      <Link to="/identities/add">
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
      {identities.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          There are no identities available. Please add a new identity.
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
            <DataGrid checkboxSelection rows={identities} columns={columns} />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default IdentityList;
