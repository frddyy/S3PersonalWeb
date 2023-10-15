import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams} from "react-router-dom";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import ButtonGroup from "@mui/material/ButtonGroup";

const OrganizationList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [identities, setIdentities]= useState("");
  const [identityId, setIdentityId]= useState("");
  const [organizations, setOrganizations]= useState([]);

  useEffect(() => {
    getIdentities();
  }, []);


  useEffect(() => {
    if (identityId !== "") {
      getOrganizations();
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

  const deleteOrganization = async (organizationId) => {
    await axios.delete(
      `http://localhost:5000/identities/${identityId}/organizations/${organizationId}`
    );
    getOrganizations();
  };


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name_org",
      headerName: "Name",
      flex: 1,
      cellClassName: "name_org-column--cell",
    },
    {
      field: "image",
      headerName: "Logo",
      flex: 1,
      cellClassName: "image-column--cell",
    },
    {
      field: "start_year",
      headerName: "Year Start",
      flex: 1,
      cellClassName: "start_year-column--cell",
    },
    {
      field: "end_year",
      headerName: "Year End",
      flex: 1,
      cellClassName: "end_year-column--cell",
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      cellClassName: "role-column--cell",
    },
    {
      field: "jobdesc",
      headerName: "Jobdesc",
      flex: 1,
      cellClassName: "jobdesc-column--cell",
    },
    {
      field: "identityId",
      headerName: "identityId",
      flex: 1,
      cellClassName: "identityId-column--cell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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
              orientation="vertical"
              aria-label="vertical outlined button group"
            >
              <Link to={`/organizations/edit/${row.id}`}>
                <Button
                  sx={{
                    backgroundColor: colors.blueAccent[600],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "5px 10px",
                  }}
                >
                Edit
              </Button>
            </Link>
            <Button
            onClick={() => deleteOrganization(row.id)}
              sx={{
                backgroundColor: colors.redAccent[600],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "5px 10px",
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="ORGANIZATIONS" subtitle="Managing the Organization    " />
      <Link to="/organizations/add">
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
        ></div>
        <DataGrid checkboxSelection rows={organizations} columns={columns} />
      </Box>
    </Box>
  );
};

export default OrganizationList;