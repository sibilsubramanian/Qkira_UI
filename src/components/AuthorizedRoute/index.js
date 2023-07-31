/**
 * This component determines if a user is authenticated and
 * allowed to visit the page they navigated to.
 *
 * If they are, proceed to the page.
 * Else, they are redirected to the login page.
 */
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../store/AppContext";
import Header from "../Header";
import Footer from "../Footer";

const AuthorizedRoute = () => {
  const { isLoggedIn } = useContext(AppContext);
  return isLoggedIn ? (
    <Header>
      <Outlet />
      <Footer />
    </Header>
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthorizedRoute;
