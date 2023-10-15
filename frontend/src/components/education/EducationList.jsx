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

const EducationList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [educations, setEducation] = useState([]);
  const [identities, setIdentities] = useState("");
  const [identityId, setIdentityId] = useState("");

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    if (identityId !== "") {
      getEducations();
    }
  }, [identityId]);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      // Assuming the first identity in the response is the user's identity
      if (response.data.length > 0) {
        const userIdentity = response.data[0];
        setIdentityId(userIdentity.id);
      }
      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(identityId);
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
      setEducation(educationsWithIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteEducations = async (educationId) => {
    await axios.delete(
      `http://localhost:5000/identities/${identityId}/educations/${educationId}`
    );
    getEducations();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name_sch",
      headerName: "school name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "image",
      headerName: "image",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "start_year",
      headerName: "Start year",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "end_year",
      headerName: "End Year",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "major",
      headerName: "Major",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "information",
      headerName: "Information",
      flex: 2,
      cellClassName: "name-column--cell",
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
            <Link to={`/educations/edit/${row.id}`}>
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
              onClick={() => deleteEducations(row.id)}
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
      <Header title="EDUCATIONS" subtitle="Managing the Education    " />
      <Link to="/educations/add">
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
      {educations.length === 0 ? (
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
            <DataGrid checkboxSelection rows={educations} columns={columns} />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default EducationList;
