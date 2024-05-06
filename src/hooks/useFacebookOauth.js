import { useEffect } from "react";

const useFacebookOauth = (appId, { onSuccess }) => {
  const signOut = async () => {
    window.FB.getLoginStatus((res) => {
      if (res.status === "connected") {
        window.FB.logout(() => {
          return "User is now logged out";
        });
      }
    });
  };

  const signIn = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api(
            "/me",
            function (response) {
              onSuccess?.(response);
            },
            {
              fields: "id,first_name,last_name,email,picture,link",
            },
          );
        } else {
          return;
        }
      },
      { scope: "email,public_profile,user_link" },
    );
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        status: true,
        xfbml: true,
        version: "v2.7",
      });

      window.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return {
    signIn,
    signOut,
  };
};

export default useFacebookOauth;
