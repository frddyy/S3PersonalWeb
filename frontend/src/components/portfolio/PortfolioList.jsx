import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonGroup from "@mui/material/ButtonGroup";

const PortfolioList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [identities, setIdentities] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    getIdentities();
  }, []);

  useEffect(() => {
    if (identityId !== "") {
      getPortfolios();
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

  const deletePortfolios = async (portfolioId) => {
    await axios.delete(
      `http://localhost:5000/identities/${identityId}/portfolios/${portfolioId}`
    );
    getPortfolios();
  };

  // Define the columns for your DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "title",
      headerName: "Judul",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Deskripsi",
      flex: 1,
      cellClassName: "image-column--cell",
    },
    {
      field: "attachment",
      headerName: "File",
      flex: 1,
      cellClassName: "pob-column--cell",
    },
    {
      field: "identityId",
      headerName: "Identity ID",
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
              <Link to={`/portfolios/edit/${row.id}`}>
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
                onClick={() => deletePortfolios(row.id)}
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
      <Header title="PORTFOLIOS" subtitle="Managing the Portfolio Identity" />
      <Link to="/portfolios/add">
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
      {portfolios.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          There are no orgnizations available. Please add a new organizations.
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
            <DataGrid checkboxSelection rows={portfolios} columns={columns} />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default PortfolioList;
