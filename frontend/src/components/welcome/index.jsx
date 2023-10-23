import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../features/AuthSlice";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Card,
  CardMedia,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailIcon from "@mui/icons-material/Mail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Dashboard = () => {
  const pdfRef = useRef();

  const downloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, {
      useCORS: true, // Mengizinkan penggunaan CORS untuk gambar
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("resume.pdf");
    });
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState("Loading..."); // Initialize with loading text
  const [profileImage, setProfileImage] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [educations, setEducations] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [userId, setUserId] = useState(""); // Initialize as an empty string
  const [identityId, setIdentityId] = useState("");
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

  useEffect(() => {
    if (identityId !== "") {
      getEducations();
      getOrganizations();
    }
  }, [identityId]);

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
      // setMajor(educationsWithIds[0].major)
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
        setAddress(userIdentity.address);
        setDescription(userIdentity.description);
        setEmail(userIdentity.email);
        setPhoneNo(userIdentity.phone_number);
        setInstagram(userIdentity.instagram);
        setLinkedin(userIdentity.linkedin);
        setGithub(userIdentity.github);
      } else {
        // Handle the case when userIdentity is not found
        // You might want to set a default value or show a loading message.
        setName("Identity Not Found");
        setProfileImage("");
      }

      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      <Box>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={downloadPDF}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download CV
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Grid
          ref={pdfRef}
          container
          spacing={0}
          bgcolor="white"
          sx={{ m: 0, p: "25px", width: "250mm" }}
        >
          {/* // profile section */}
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "1fr 1fr", // Dua kolom dengan ukuran fraksi (fleksibel)
              gridTemplateRows: "repeat(10, auto)", // Ukuran baris otomatis
              gap: 1,
              padding: 2,
              marginY: "auto", // Menambahkan marginY: 'auto' untuk tengah secara vertikal
            }}
          >
            <Box
              sx={{
                gridColumn: "1",
                gridRow: "1/7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "100%" }}>
                <CardMedia
                  component="img"
                  id="image_identity"
                  style={{
                    height: "180px",
                    width: "auto",
                    borderRadius: "100%",
                  }}
                  image={`http://localhost:5000/image/identity/` + profileImage}
                  // onLoad={downloadPDF}
                  alt="profile picture"
                  sx={{
                    objectFit: "cover",
                  }}
                />
              </Card>
            </Box>
            <Box
              sx={{
                gridColumn: "1",
                gridRow: "7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                id="name_identity"
                variant="h2"
                color={colors.grey[700]}
                fontWeight="bold"
              >
                {name}
              </Typography>
            </Box>

            <Box
              sx={{
                gridColumn: "1",
                gridRow: "8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                id="major_edu"
                variant="h4"
                color={colors.grey[700]}
              ></Typography>
            </Box>
            <Box
              sx={{
                gridColumn: "1",
                gridRow: "9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginX: "auto", // Menambahkan marginX: 'auto'
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Typography
                id="address_identity"
                variant="h5"
                color={colors.grey[700]}
              >
                {address}
              </Typography>
            </Box>

            <Box
              sx={{
                gridColumn: "2",
                gridRow: "1/8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginX: "auto", // Menambahkan marginX: 'auto'
                marginY: "auto", // Menambahkan marginY: 'auto'
                width: "453px",
                overflow: "hidden",
              }}
            >
              <Typography
                id="description_identity"
                variant="h5"
                color={colors.grey[700]}
              >
                {description}
              </Typography>
            </Box>

            <Box
              sx={{
                gridColumn: "2",
                gridRow: "8",
                display: "grid", // Menggunakan grid layout
                gridTemplateColumns: "1fr 1fr 1fr", // Membagi menjadi tiga kolom dengan ukuran yang sama
                alignItems: "center",
                justifyContent: "center",
                marginX: "auto",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr", // Membagi menjadi dua kolom
                  gap: 1,
                  alignItems: "center",
                  marginX: "auto",
                  width: "100%",
                }}
              >
                <Link to={linkedin}>
                  <LinkedInIcon style={{ color: colors.grey[700] }} />
                </Link>

                {/* <Typography
                  variant="h5"
                  id="linkedin_identity"
                  color={colors.grey[700]}
                >
                  {linkedin}
                </Typography> */}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr", // Membagi menjadi dua kolom
                  gap: 1,
                  alignItems: "center",
                  marginX: "auto",
                  width: "100%",
                }}
              >
                <Link to={instagram}>
                  <InstagramIcon style={{ color: colors.grey[700] }} />
                </Link>
                {/* <Typography
                  variant="h5"
                  id="instagram_identity"
                  color={colors.grey[700]}
                >
                  Instagram
                </Typography> */}
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr", // Membagi menjadi dua kolom
                  gap: 1,
                  alignItems: "center",
                  marginX: "auto",
                  width: "100%",
                }}
              >
                <Link to={github}>
                  <GitHubIcon style={{ color: colors.grey[700] }} />
                </Link>
                {/* <Typography
                  variant="h5"
                  id="github_identity"
                  color={colors.grey[700]}
                >
                  GitHub
                </Typography> */}
              </Box>
            </Box>

            <Box
              sx={{
                gridColumn: "2",
                gridRow: "9",
                display: "grid", // Menggunakan grid layout
                gridTemplateColumns: "Auto 1fr", // Membagi menjadi tiga kolom dengan ukuran yang sama
                alignItems: "center",
                justifyContent: "center",
                marginX: "auto",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr", // Membagi menjadi dua kolom
                  gap: 1,
                  alignItems: "center",
                  marginX: "auto",
                  width: "100%",
                }}
              >
                <Link to={phoneNo}>
                  <LocalPhoneIcon style={{ color: colors.grey[700] }} />
                </Link>
                <Typography
                  variant="h5"
                  id=" phone_number_identity"
                  color={colors.grey[700]}
                >
                  {phoneNo}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr", // Membagi menjadi dua kolom
                  gap: 1,
                  alignItems: "center",
                  marginX: "25px",
                  width: "100%",
                }}
              >
                <Link to={email}>
                  <MailIcon style={{ color: colors.grey[700] }} />
                </Link>
                <Typography
                  variant="h5"
                  id="email_identity"
                  color={colors.grey[700]}
                >
                  {email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          container
          spacing={0}
          bgcolor="white"
          sx={{ m: 0, p: 0, width: "250mm" }}
        >
          {/* education section */}
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateRows: "repeat(10, auto)", // Setiap elemen akan memiliki baris otomatis
              gap: 1,
              padding: 2,
            }}
          >
            <Typography
              variant="h2"
              id="education_title"
              color={colors.grey[700]}
              fontWeight="bold"
            >
              Education
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "Auto 1fr", // Dua kolom dengan ukuran fraksi (fleksibel)
                gridTemplateRows: "repeat(10, auto)", // Ukuran baris otomatis
                gap: 1,
                padding: 2,
              }}
            >
              <CardMedia
                component="img"
                id="image_edu"
                style={{
                  height: "100px",
                  width: "auto",
                  borderRadius: "100%",
                  marginTop: "20px",
                }}
                image="https://sps.widyatama.ac.id/wp-content/uploads/2020/08/dummy-profile-pic-male1.jpg"
                alt="profile picture"
                sx={{
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "1fr", // Hanya satu kolom di sini
                  gridTemplateRows: "repeat(4, 15px)", // Empat baris dengan ukuran otomatis
                  gap: 1,
                  alignItems: "center", // Rata tengah secara vertikal
                  padding: 1,
                }}
              >
                <Typography
                  variant="h3"
                  id="name_sch_edu"
                  color={colors.grey[700]}
                  fontWeight="bold"
                >
                  SMAN 1 Garut
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateColumns: "auto auto auto 1fr auto",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    id="start_year_edu"
                    color={colors.grey[700]}
                  >
                    2018
                  </Typography>
                  <Typography variant="h5" color={colors.grey[700]}>
                    -
                  </Typography>
                  <Typography
                    variant="h5"
                    id="end_year_edu"
                    color={colors.grey[700]}
                  >
                    2021
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  id="major_edu"
                  color={colors.grey[700]}
                >
                  Jurusan Matematika dan IPA
                </Typography>
              </Box>
            </Box>

            <Grid
              container
              spacing={2}
              bgcolor="white"
              sx={{ m: 0, p: 0, width: "210mm" }}
            >
              {/* Organization section */}
              <Box
                sx={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateRows: "repeat(10, auto)",
                  gap: 1,
                  padding: 0,
                }}
              >
                <Typography
                  variant="h2"
                  id="organization_title"
                  color={colors.grey[700]}
                  fontWeight="bold"
                >
                  Organization
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: "row",
                    gridTemplateColumns: "Auto 1fr 1fr", // Satu tambahan kolom di sini
                    gridTemplateRows: "repeat(10, auto)",
                    gap: 1,
                    padding: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    id="image_org"
                    style={{
                      height: "100px",
                      width: "auto",
                      borderRadius: "100%",
                    }}
                    image="https://sps.widyatama.ac.id/wp-content/uploads/2020/08/dummy-profile-pic-male1.jpg"
                    alt="organization picture"
                    sx={{
                      objectFit: "cover",
                    }}
                  />

                  <Box
                    sx={{
                      display: "grid",
                      gridAutoFlow: "row",
                      gridTemplateColumns: "1fr", // Hanya satu kolom di sini
                      gridTemplateRows: "repeat(4, 15px)", // Empat baris dengan ukuran otomatis
                      gap: 1,
                      alignItems: "center", // Rata tengah secara vertikal
                      padding: 1,
                    }}
                  >
                    <Typography
                      variant="h3"
                      id="name_org"
                      color={colors.grey[700]}
                      fontWeight="bold"
                    >
                      Nama Organisasi
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateColumns: "auto auto auto 1fr auto",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        id="start_year_org"
                        color={colors.grey[700]}
                      >
                        2017
                      </Typography>
                      <Typography variant="h5" color={colors.grey[700]}>
                        -
                      </Typography>
                      <Typography
                        variant="h5"
                        id="end_year_org"
                        color={colors.grey[700]}
                      >
                        2021
                      </Typography>
                    </Box>

                    <Typography
                      variant="h4"
                      id="role_org"
                      color={colors.grey[700]}
                    >
                      Peran dalam Organisasi
                    </Typography>
                    <Typography
                      variant="h5"
                      id="jobdesc_org"
                      color={colors.grey[700]}
                    >
                      Deskripsi Pekerjaan
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Typography
              variant="h2"
              id="skill_title"
              color={colors.grey[700]}
              fontWeight="bold"
            >
              Skill
            </Typography>
            <Grid
              container
              spacing={0}
              bgcolor="white"
              sx={{ m: 0, p: 0, width: "210mm" }}
            >
              {/* Skill section */}

              <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                {/* Kolom pertama */}
                <Grid item xs={3}>
                  <Box
                    sx={{
                      border: "1px solid #ccc", // Border tipis dengan warna abu-abu
                      borderRadius: "5px", // Kelengkungan sedikit
                      padding: "10px", // Jarak dalam dari border
                    }}
                  >
                    <CardMedia
                      component="img"
                      id="thumbnail_skill1"
                      style={{ height: "100px", width: "auto" }}
                      image="https://bpkd.rejanglebongkab.go.id/wp-content/uploads/2019/11/dummy-logo-6.jpg"
                      alt="skill picture 1"
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <Typography
                      variant="h3"
                      id="title_skill1"
                      color={colors.grey[700]}
                      fontWeight="bold"
                    >
                      Nama Skill 1
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_label1"
                      color={colors.grey[700]}
                    >
                      Level:
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_skill1"
                      color={colors.grey[700]}
                    >
                      Tingkat Skill Anda 1
                    </Typography>
                  </Box>
                </Grid>

                {/* Kolom kedua */}
                <Grid item xs={3}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      id="thumbnail_skill2"
                      style={{ height: "100px", width: "auto" }}
                      image="https://bpkd.rejanglebongkab.go.id/wp-content/uploads/2019/11/dummy-logo-6.jpg"
                      alt="skill picture 2"
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <Typography
                      variant="h3"
                      id="title_skill2"
                      color={colors.grey[700]}
                      fontWeight="bold"
                    >
                      Nama Skill 2
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_label2"
                      color={colors.grey[700]}
                    >
                      Level:
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_skill2"
                      color={colors.grey[700]}
                    >
                      Tingkat Skill Anda 2
                    </Typography>
                  </Box>
                </Grid>

                {/* Kolom ketiga */}
                <Grid item xs={3}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      id="thumbnail_skill3"
                      style={{ height: "100px", width: "auto" }}
                      image="https://bpkd.rejanglebongkab.go.id/wp-content/uploads/2019/11/dummy-logo-6.jpg"
                      alt="skill picture 3"
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <Typography
                      variant="h3"
                      id="title_skill3"
                      color={colors.grey[700]}
                      fontWeight="bold"
                    >
                      Nama Skill 3
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_label3"
                      color={colors.grey[700]}
                    >
                      Level:
                    </Typography>
                    <Typography
                      variant="h5"
                      id="level_skill3"
                      color={colors.grey[700]}
                    >
                      Tingkat Skill Anda 3
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={0}
              bgcolor="white"
              sx={{ m: 0, p: 0, width: "210mm", marginTop: "50px" }}
            >
              {/* Portofolio section */}
              <Box
                sx={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateRows: "repeat(10, auto)",
                  gap: 1,
                  padding: 0,
                }}
              >
                <Typography
                  variant="h2"
                  id="portfolio_title"
                  color={colors.grey[700]}
                  fontWeight="bold"
                >
                  Portofolio
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: "row",
                    gridTemplateColumns: "Auto 1fr",
                    gridTemplateRows: "repeat(10, auto)",
                    gap: 1,
                    padding: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    id="image_portfolio"
                    style={{
                      height: "100px",
                      width: "auto",
                      borderRadius: "5px",
                    }}
                    image="https://example.com/your-image-url.jpg"
                    alt="portfolio picture"
                    sx={{
                      objectFit: "cover",
                    }}
                  />

                  <Box
                    sx={{
                      display: "grid",
                      gridAutoFlow: "row",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "repeat(4, 15px)",
                      gap: 1,
                      alignItems: "center",
                      padding: 1,
                    }}
                  >
                    <Typography
                      variant="h3"
                      id="title_portfolio"
                      color={colors.grey[700]}
                      fontWeight="bold"
                    >
                      Nama Portofolio
                    </Typography>

                    <Typography
                      variant="h4"
                      id="description_portfolio"
                      color={colors.grey[700]}
                    >
                      Deskripsi Portofolio
                    </Typography>

                    <Typography
                      variant="h4"
                      id="attachment_portfolio"
                      color={colors.grey[700]}
                    >
                      Attachment
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
