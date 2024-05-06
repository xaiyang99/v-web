import { motion } from "framer-motion";
import React from "react";
import { useInView } from "react-intersection-observer";
import { mapAnimation } from "../animation/index";

// material ui
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TelegramIcon from "@mui/icons-material/Telegram";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// components
import AppBar from "../home/Appbar";
import Footer from "../home/Footer";

// functions
import { useMutation } from "@apollo/client";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import { MUTATION_CONTACT } from "../home/apollo";

// css
const ContactContainer = styled(Container)(({ theme }) => ({
  marginTop: "4rem",
  display: "flex",
  textAlign: "center",
  padding: "4rem 0",
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: "4rem 1rem",
    marginTop: "2rem",
  },
}));

const BoxContactUs = styled(Box)(({ theme }) => ({
  width: "48%",
  padding: "2rem 0",
  border: "1px solid #17766B",
  borderRadius: "5px",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    border: "none",
    width: "100%",
    order: -1,
  },
}));

const ContainerContactUs = styled(Container)({
  display: "flex",
  textAlign: "start",
  justifyContent: "start",
  flexDirection: "column",
});

const BoxContactUsHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  flexDirection: "column",
  color: "#17766B",
  b: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    height: "auto",
  },
  p: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    lineHeight: 1.25,
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    b: {
      fontSize: "1rem",
      marginBottom: "0",
      padding: "0",
    },
    p: {
      fontSize: "0.8rem",
      margin: "0.5rem 0 0 0",
    },
  },
}));

const BoxShowContactForm = styled("form")(({ theme }) => ({
  margin: "2rem 0",
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 0",
  },
}));

const BoxShowSendMessageBTN = styled(Box)({
  textAlign: "start",
  marginTop: "2rem",
});

const ButtonSendMessage = styled(Button)(({ theme }) => ({
  background: "#17766B",
  color: "#ffffff",
  "&:hover": {
    background: "#17766B",
    color: "#ffffff",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "0",
  },
}));

const BoxGetinTouch = styled(Box)(({ theme }) => ({
  width: "50%",
  padding: "2rem",
  display: "flex",
  textAlign: "start",
  justifyContent: "start",
  flexDirection: "column",
  background: "#17766B",
  borderRadius: "5px",
  color: "#ffffff",
  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    height: "auto",
  },
  h6: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    lineHeight: 1.25,
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 1rem",
    width: "100%",
    h2: {
      fontSize: "1rem",
      marginBottom: "0",
      padding: "0",
    },
    h6: {
      fontSize: "0.8rem",
      margin: "0.5rem 0 0 0",
    },
  },
}));

const GetinTouchDetail = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  padding: "0.4rem 0",
});

function Index() {
  const theme = createTheme();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [createContact] = useMutation(MUTATION_CONTACT);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const { ref: ref7, inView: inView7 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      const contact = await createContact({
        variables: {
          body: {
            name: username,
            email: email,
            message: message,
          },
        },
      });
      if (contact?.data?.createContact?._id) {
        successMessage("Check your email for the respon!!", 3000);
        setUsername("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      errorMessage("Somthing went wrong. Please try again later!", 3000);
    }
  };
  return (
    <React.Fragment>
      <AppBar />
      <ContactContainer>
        <BoxGetinTouch>
          <Typography variant="h2">Let's get in tounch</Typography>
          <Box>
            <Typography
              variant=""
              sx={{ fontSize: "0.8rem", fontWeight: "500" }}
            >
              Should you have any questions or encounter any issues, please
              don't hesitate to reach out to us. We are committed to providing
              the best assistance and ensuring your satisfaction. Thank you for
              considering us.
            </Typography>
          </Box>
          <Box>
            <GetinTouchDetail>
              <LocationOnIcon sx={{ fontSize: "18px" }} />
              &nbsp;&nbsp;
              <Typography variant="">
                NongNieng village, Saysettha district and Vientiane Capital.
              </Typography>
            </GetinTouchDetail>
            <GetinTouchDetail>
              <LocalPhoneIcon sx={{ fontSize: "18px" }} />
              &nbsp;&nbsp;
              <Typography variant="">+856 21755789</Typography>
            </GetinTouchDetail>
            <GetinTouchDetail>
              <EmailIcon sx={{ fontSize: "18px" }} />
              &nbsp;&nbsp;
              <Typography variant="">support@vshare.net</Typography>
            </GetinTouchDetail>
          </Box>
        </BoxGetinTouch>
        <BoxContactUs ref={ref7}>
          <ContainerContactUs maxWidth="lg">
            <BoxContactUsHeader>
              <motion.b
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                Send us a Message
              </motion.b>
              <motion.p
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                Your message will be directed to our support team, who will
                respond via the email address you provided.
              </motion.p>
            </BoxContactUsHeader>
            <BoxShowContactForm onSubmit={handleSubmitContact}>
              <motion.div
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                <Grid container spacing={isMobile ? 2 : 6}>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",
                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      required
                      fullWidth
                      name="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                          color: "#17766B",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      required
                      fullWidth
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                          color: "#17766B",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Message"
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      rows={4}
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                          color: "#17766B",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <BoxShowSendMessageBTN>
                  <ButtonSendMessage
                    startIcon={<TelegramIcon />}
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{
                      fontSize: "1rem",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.8rem",
                      },
                    }}
                  >
                    Send Message
                  </ButtonSendMessage>
                </BoxShowSendMessageBTN>
              </motion.div>
            </BoxShowContactForm>
          </ContainerContactUs>
        </BoxContactUs>
      </ContactContainer>
      <Footer />
    </React.Fragment>
  );
}

export default Index;
