import React, { useState } from "react";
import * as MUI from "../css/style";
import { motion } from "framer-motion";
import { useLazyQuery } from "@apollo/client";
import { useInView } from "react-intersection-observer";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// component
import AppBar from "../home/Appbar";
import Footer from "../home/Footer";
import { mapAnimation } from "../animation";
import { QUERY_ALL_MAIN_FEATURES } from "../home/apollo";
import FeatureComponent from "../components/FeatureComponent";

// material ui component or icons
import { Container, Grid, useMediaQuery } from "@mui/material";
// import { Carousel } from "react-responsive-carousel";

function Feature() {
  const [color, setColor] = useState(false);
  const [features, setFeatures] = React.useState([]);

  const [queryFeature, { data: featureData }] = useLazyQuery(
    QUERY_ALL_MAIN_FEATURES
  );

  React.useEffect(() => {
    queryFeature({
      variables: {
        limit: 20,
      },
    });
    setFeatures(featureData?.features?.data);
  }, [featureData]);

  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };

  window.addEventListener("scroll", changeColor);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { ref: ref1, inView: inView1 } = useInView({
    threshold: 0.2,
  });
  return (
    <React.Fragment>
      <AppBar color={color} />
      <MUI.BoxFeatureContainer
        maxWidth="lg"
        sx={{ marginTop: isMobile ? "5rem" : "8rem" }}
        ref={ref1}
      >
        <MUI.BoxFeatureHeader>
          <motion.b
            variants={mapAnimation}
            initial="hidden"
            animate={inView1 ? "show" : "hidden"}
          >
            Features
          </motion.b>
          <motion.p
            variants={mapAnimation}
            initial="hidden"
            animate={inView1 ? "show" : "hidden"}
          >
            &nbsp; Welcome to vShare.net, your ultimate destination for
            hassle-free file sharing! With our free file-sharing service, you
            can upload and share your files with ease, from anywhere in the
            world. And with the ability to generate sharelinks, sending your
            files to friends, family, and colleagues has never been easier. At
            vShare.net, we understand the importance of speed. That's why our
            file-sharing service offers lightning-fast upload and download
            speeds, ensuring that you can share your files quickly and without
            any delays. Plus, our user-friendly interface and intuitive features
            make uploading and sharing your files a breeze. With vShare.net, you
            can rest assured that your files are in safe hands. We employ
            state-of-the-art security measures to protect your files from
            unauthorized access, ensuring that your privacy is always protected.
            So, what are you waiting for? Sign up for vShare.net today and
            experience the best in hassle-free file sharing!
          </motion.p>
        </MUI.BoxFeatureHeader>
        <MUI.BoxShowFeature>
          {/* {!isMobile && ( */}
          <Grid container spacing={isMobile ? 2 : 4}>
            {features?.map((val, index) => (
              <Grid item lg={3} md={4} sm={6} xs={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                    borderRadius: "5px",
                    background: "#F3F8F7",
                  }}
                >
                  <FeatureComponent
                    title={val.title}
                    content={val.Content1}
                    image={val.image}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
          {/* // )} */}
          {/* {isMobile && (
            <Container
              sx={{
                width: "22rem",
                margin: "2rem 0",
              }}
              maxWidth="lg"
            >
              <Carousel
                showArrows={false}
                showStatus={false}
                showThumbs={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={3000}
                transitionTime={800}
                stopOnHover={true}
              >
                {features?.map((val, index) => (
                  <FeatureComponent
                    key={index}
                    title={val.title}
                    content={val.Content1}
                    image={val.image}
                  />
                ))}
              </Carousel>
            </Container>
          )} */}
        </MUI.BoxShowFeature>
      </MUI.BoxFeatureContainer>
      <Footer />
    </React.Fragment>
  );
}

export default Feature;
