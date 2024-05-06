import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import {
  accessTokenLocalKey,
  decryptData,
  permissionLocalKey,
  userDataLocalKey,
} from "../../functions";
import useAuth from "../../hooks/useAuth";

// For routes that can only be accessed by authenticated users
function TokenValidation({ children, tokenCheck }) {
  const navigate = useNavigate();
  const MUTATION = gql`
    mutation StaffTokenValidation($where: CheckTokenInput) {
      staffTokenValidation(where: $where) {
        data
        status
      }
    }
  `;

  const [tokenValidation] = useMutation(MUTATION);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await tokenValidation({
          variables: {
            where: {
              token: String(tokenCheck),
            },
          },
        });
        if (data?.staffTokenValidation?.status !== 200) {
          localStorage.removeItem(accessTokenLocalKey);
          navigate("/admin/login");
        }
      } catch (error) {
        localStorage.removeItem(accessTokenLocalKey);
        navigate("/admin/login");
      }
    })();
  }, [tokenValidation]);
  return <React.Fragment>{children}</React.Fragment>;
}

function AuthGuard({ children }) {
  // const token = localStorage.getItem("accessToken");
  const token = localStorage.getItem(accessTokenLocalKey);
  const { isAuthenticated, isInitialized } = useAuth();
  // const userData = localStorage.getItem("userData");
  const userData = localStorage.getItem(userDataLocalKey);
  let myObject = null;
  if (userData) {
    myObject = JSON.parse(decryptData(userData));
  }

  const role = myObject?.role?.name;

  if (isInitialized && !isAuthenticated) {
    localStorage.removeItem(accessTokenLocalKey);
    localStorage.removeItem(permissionLocalKey);
    return <Navigate to="/admin/login" />;
  }

  if (!token) {
    localStorage.removeItem(permissionLocalKey);
    return <Navigate to="/admin/login" />;
  }

  if (!role) {
    localStorage.removeItem(accessTokenLocalKey);
    localStorage.removeItem(permissionLocalKey);
    return <Navigate to="/admin/login" />;
  }

  return <TokenValidation tokenCheck={token}>{children}</TokenValidation>;
}

export default AuthGuard;
