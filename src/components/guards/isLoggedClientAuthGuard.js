import { gql, useMutation } from "@apollo/client";
import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessTokenLocalKey } from "../../functions";

function TokenValidation({ children, tokenCheck }) {
  const navigate = useNavigate();
  const MUTATION = gql`
    mutation TokenValidation($where: CheckTokenInput) {
      tokenValidation(where: $where) {
        status
        data
      }
    }
  `;
  const [tokenValidation] = useMutation(MUTATION);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await tokenValidation({
          variables: {
            where: {
              token: String(tokenCheck),
            },
          },
        });
        if (data?.tokenValidation?.status === 200) {
          return navigate("/dashboard");
        }
      } catch (error) {
        // localStorage.removeItem("accessToken");
        localStorage.removeItem(accessTokenLocalKey);
        return navigate("/auth/sign-in");
      }
    })();
  }, [tokenValidation]);

  return <Fragment>{children}</Fragment>;
}

function isLoggedClientAuthGuard({ children }) {
  // const token = localStorage.getItem("accessToken");
  const token = localStorage.getItem(accessTokenLocalKey);

  return <TokenValidation tokenCheck={token}>{children}</TokenValidation>;
}

export default isLoggedClientAuthGuard;
