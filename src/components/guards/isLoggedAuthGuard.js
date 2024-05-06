import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { accessTokenLocalKey, userDataLocalKey } from "../../functions";

function isLoggedAuthGuard({ children }) {
  // const token = localStorage.getItem("accessToken");
  const token = localStorage.getItem(accessTokenLocalKey);

  // const userData = localStorage.getItem("userData");
  const userData = localStorage.getItem(userDataLocalKey);
  const myObject = JSON.parse(userData);
  const role = myObject?.role?.name;

  if (token) {
    return <Navigate to="/dashboard/default" />;
  }

  if (role) {
    return <Navigate to="/dashboard/default" />;
  }

  return <Fragment>{children}</Fragment>;
}

export default isLoggedAuthGuard;
