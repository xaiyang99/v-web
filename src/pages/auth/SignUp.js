import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import * as MUI from "./css/signUp";

// components
import SignUpComponent from "../../components/auth/SignUp";
import vShareLogo from "../../utils/images/Logo_Vshare_all_white-11.svg";

// material icons and component
import { useMutation } from "@apollo/client";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { IconButton, Link, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { errorMessage } from "../../components/Alerts";
import { SETTING_KEYS } from "../../constants";
import { handleGraphqlErrors } from "../../functions";
import useAuth from "../../hooks/useAuth";
import useFacebookOauth from "../../hooks/useFacebookOauth";
import useGithubOauth from "../../hooks/useGithubOauth";
import useGoogleOauth from "../../hooks/useGoogleOauth";
import useManageSetting from "../dashboards/settings/hooks/useManageSetting";
import {
  MUTATION_FACEBOOK_OAUTH,
  MUTATION_GOOGLE_AUTH,
} from "./apollo/SignIn/Login";
import { LeftBoxRowAuthenticationLimit } from "./css/style";

const {
  REACT_APP_GOOGLE_CLIENT_ID,
  REACT_APP_FACEBOOk_APP_ID,
  REACT_APP_GITHUB_CLIENT_ID,
} = process.env;

function SignUp() {
  const theme = useTheme();
  const [signUpCount, setSignUpCount] = useState(0);
  const [showGithub, setShowGithub] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [showFacebook, setShowFacebook] = useState(false);
  const [hideSignUp, setHideSignUp] = useState(false);
  const [signUpCaptcha, setSignUpCaptcha] = useState(null);
  const [signUpLimit, setSignUpLimit] = useState(null);
  const [timestamp, setTimestamp] = useState(60);
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { oauthLogin } = useAuth();
  const [signUpWithGoogle] = useMutation(MUTATION_GOOGLE_AUTH);
  const [signUpWithFacebook] = useMutation(MUTATION_FACEBOOK_OAUTH);
  const useDataSetting = useManageSetting();

  const googleOauth = useGoogleOauth(REACT_APP_GOOGLE_CLIENT_ID, {
    onSuccess: async (googleDetails) => {
      try {
        await signUpWithGoogle({
          variables: {
            dataInput: {
              ip: "103.43.77.35",
              sendToken: googleDetails.credential,
            },
          },

          onCompleted: async (res) => {
            const [data] = res.loginWithGoogle.data;
            const token = res.loginWithGoogle.token;
            oauthLogin(data, token);
          },
        });
      } catch (e) {
        const message = handleGraphqlErrors(e.message);
        if (message) {
          errorMessage(message, 3000);
        }
      }
    },
  });

  const facebookOauth = useFacebookOauth(REACT_APP_FACEBOOk_APP_ID, {
    onSuccess: async (facebookUser) => {
      try {
        const { first_name, last_name, picture } = facebookUser;
        await signUpWithFacebook({
          variables: {
            dataInput: {
              ip: "103.43.77.35",
              accountId: facebookUser.id,
              firstName: first_name,
              lastName: last_name,
              email: facebookUser.email,
              provider: "facebook",
              username: `${first_name} ${last_name}`,
              profile: picture.data.url,
            },
          },
          onCompleted: async (res) => {
            const [data] = res.loginWithFacebook.data;
            const token = res.loginWithFacebook.token;
            oauthLogin(data, token);
          },
        });
      } catch (e) {
        const message = handleGraphqlErrors(e.message);
        if (message) {
          errorMessage(message, 3000);
        }
      }
    },
  });

  const githubOauth = useGithubOauth(REACT_APP_GITHUB_CLIENT_ID, {
    onSuccess: async (githubUser) => {
      await socialAuth({
        variables: {
          where: {
            accountId: githubUser.accountId,
            email: githubUser.username,
          },
        },
        onCompleted: async (res) => {
          const [data] = res.socialAuth.data;
          const token = res.socialAuth.token;
          oauthLogin(data, token);
        },
      });
    },
  });

  const handleSignUpFailure = () => {
    // setSignUpCount(signUpCount + 1);
    // if (signUpCount === parseInt(signUpLimit?.action)) {
    //   setHideSignUp(true);
    // }
  };

  function findDataSetting(productKey) {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  }

  useEffect(() => {
    const getDataSetting = () => {
      // Sign up Captcha
      const signUpData = findDataSetting(SETTING_KEYS.CAPCHA_GOOGLE);
      if (!!signUpData) setSignUpCaptcha(signUpData);

      // Sign up limit
      const signUpLimitData = findDataSetting(SETTING_KEYS.SIGN_IN_LIMIT);
      if (!!signUpLimitData) {
        setSignUpLimit(signUpLimitData);
      }

      // Github
      const githubData = findDataSetting(SETTING_KEYS.OAUTH_GITHUB);
      if (!!githubData) {
        const data = githubData?.status;
        if (data === "on") setShowGithub(true);
      }

      // Facebook
      const facebookData = findDataSetting(SETTING_KEYS.OAUTH_FACEBOOK);
      if (!!facebookData) {
        const data = facebookData?.status;
        if (data === "on") setShowFacebook(true);
      }

      // Google
      const googleData = findDataSetting(SETTING_KEYS.OAUTH_GOOGLE);
      if (!!googleData) {
        const data = googleData?.status;
        if (data === "on") setShowGoogle(true);
      }

      // End
    };

    getDataSetting();
  }, [useDataSetting.data]);

  useEffect(() => {
    if (hideSignUp) {
      // const interval = setInterval(() => {
      //   if (timestamp >= 0) {
      //     setTimestamp(() => timestamp - 1);
      //   }
      // }, 1000);
      // if (timestamp <= 0) {
      //   setSignUpCount(0);
      //   setHideSignUp(false);
      //   setTimestamp(60);
      // }
      // return () => clearInterval(interval);
    }
  }, [hideSignUp, timestamp]);

  return (
    <React.Fragment>
      <MUI.BoxSignUp>
        <MUI.LeftBox>
          <MUI.BoxShowLogo>
            <Link href="/">
              <img src={vShareLogo} alt="logo" />
            </Link>
          </MUI.BoxShowLogo>
          <MUI.BoxShowText>
            <Typography variant="" sx={{ fontSize: "3.5rem", fontWeight: 700 }}>
              Welcome Back!
            </Typography>
            <MUI.BoxShowDetail>
              <Typography variant="h4">
                To keep connected with us please
              </Typography>
              <Typography variant="h4">
                login with your personal info
              </Typography>
            </MUI.BoxShowDetail>
            <MUI.ButtonLogin component={NavLink} to="/auth/sign-in">
              Login
            </MUI.ButtonLogin>
          </MUI.BoxShowText>
        </MUI.LeftBox>
        <MUI.RightBox>
          {hideSignUp ? (
            <LeftBoxRowAuthenticationLimit>
              <Typography variant="h2">Whoops something went wrong.</Typography>
              <Typography variant="h4">
                To many login attemps. Please try again in{" "}
                <strong> {timestamp} </strong> seconds
              </Typography>
            </LeftBoxRowAuthenticationLimit>
          ) : (
            <MUI.BoxShowSignUpDetail>
              <Typography
                variant=""
                sx={{
                  fontSize: mobileScreen ? "1.5rem" : "2rem",
                  fontWeight: 700,
                  color: "#17766B",
                }}
              >
                Create Account
              </Typography>
              <MUI.BoxShowSocialMediaSignUp>
                {showGoogle && (
                  <IconButton
                    onClick={() => googleOauth.googleButton.click()}
                    sx={{
                      border: "1px solid gray",
                      width: mobileScreen ? "30px" : "50px",
                      height: mobileScreen ? "30px" : "50px",
                      margin: "0 1rem",
                    }}
                  >
                    <GoogleIcon />
                  </IconButton>
                )}

                {showFacebook && (
                  <IconButton
                    onClick={() => facebookOauth.signIn()}
                    sx={{
                      border: "1px solid gray",
                      width: mobileScreen ? "30px" : "50px",
                      height: mobileScreen ? "30px" : "50px",
                      margin: "0 1rem",
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                )}

                {showGithub && (
                  <IconButton
                    onClick={() => githubOauth.handleGithubSignIn()}
                    sx={{
                      border: "1px solid gray",
                      width: mobileScreen ? "30px" : "50px",
                      height: mobileScreen ? "30px" : "50px",
                      margin: "0 1rem",
                    }}
                  >
                    <GitHubIcon />
                  </IconButton>
                )}
              </MUI.BoxShowSocialMediaSignUp>
              <Typography
                variant=""
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.9rem",
                  },
                }}
              >
                Or use your email for registration:
              </Typography>
            </MUI.BoxShowSignUpDetail>
          )}

          <MUI.BoxShowFormik>
            <SignUpComponent
              signUpCaptcha={signUpCaptcha}
              handleSignUpFailure={handleSignUpFailure}
              hideSignUp={hideSignUp}
            />
          </MUI.BoxShowFormik>
        </MUI.RightBox>
      </MUI.BoxSignUp>
    </React.Fragment>
  );
}

export default SignUp;
