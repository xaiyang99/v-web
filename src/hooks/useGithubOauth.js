import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useGithubOauth = (clientId, { onSuccess }) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams] = useSearchParams();
  const GITHUB_OAUTH_URL = "https://vshare.net/auth/github";
  const handleGithubSignIn = () => {
    window.location.replace(GITHUB_OAUTH_URL);
  };
  useEffect(() => {
    const queryParamMe = searchParams.get("me");
    if (queryParamMe) {
      onSuccess(JSON.parse(queryParamMe).data);
    }
  }, [searchParams, clientId]);
  return {
    handleGithubSignIn,
  };
};

export default useGithubOauth;
