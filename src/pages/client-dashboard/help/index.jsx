import React from "react";
import * as MUI from "../css/helpStyle";

// components
import ArticalCard from "./ArticleCard";
import KnowledgeArticle from "./KnowladgeCard";

// material ui icons and component
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Index() {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <React.Fragment>
      <MUI.PaperGlobal
        sx={{
          padding: "0rem !important",
          background: "#FFFFFF !important",
          marginTop: "2rem",
        }}
      >
        <MUI.BoxShowHelpSection1>
          <Typography variant="h2">Hello, how can we help you?</Typography>
          <FormControl
            sx={{ width: isMobile ? "80%" : "40%", margin: "1rem 0" }}
          >
            <OutlinedInput
              placeholder="Search a question..."
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ marginLeft: "0.5rem" }} />
                </InputAdornment>
              }
              sx={{
                fontSize: "0.8rem",
                fontWeight: "500",
                color: "#5D596C",
                padding: isMobile ? "0" : "0.2rem 0",
                background: "#ffffff",
                border: "none",
                outline: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 6px -2px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px",
              }}
            />
          </FormControl>
          <Typography variant="h6">
            Or choose a category to quickly find the help your need
          </Typography>
        </MUI.BoxShowHelpSection1>

        <MUI.BoxShowHelpSection2>
          <Typography variant="h3">Popular Articles</Typography>
          <MUI.BoxShowArticle>
            <Grid container spacing={isMobile ? 2 : 8}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
            </Grid>
          </MUI.BoxShowArticle>
        </MUI.BoxShowHelpSection2>

        <MUI.BoxShowHelpSection3>
          <Typography variant="h3">Knowladge Base</Typography>
          <MUI.BoxShowKnowladgeCard>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <KnowledgeArticle />
              </Grid>
            </Grid>
          </MUI.BoxShowKnowladgeCard>
        </MUI.BoxShowHelpSection3>

        <MUI.BoxShowHelpSection4>
          <Typography variant="h3">Keep learning</Typography>
          <MUI.BoxShowArticle>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ArticalCard />
              </Grid>
            </Grid>
          </MUI.BoxShowArticle>
        </MUI.BoxShowHelpSection4>

        <MUI.BoxShowHelpSection5>
          <Typography variant="h3">Still need help?</Typography>
          <Box
            sx={{
              margin: "1rem 0",
              textAlign: "center",
              padding: isMobile ? "1rem" : "",
            }}
          >
            <Typography variant="h6">
              Our specialists are always happy to help.
            </Typography>
            <Typography variant="h6">
              Contact us during standard business hours or email us 24-7, and
              we'll get back to you
            </Typography>
          </Box>
          <MUI.BoxShowButton>
            <MUI.HelpButton>Visit our comunity</MUI.HelpButton>
            <MUI.HelpButton>Contact us</MUI.HelpButton>
          </MUI.BoxShowButton>
        </MUI.BoxShowHelpSection5>
      </MUI.PaperGlobal>
    </React.Fragment>
  );
}

export default Index;
