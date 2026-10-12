import { createBrowserRouter, redirect } from "react-router-dom";

import { Root, RouteError, Shell } from "./components/layout/Shell.jsx";
import {
  adminAction,
  adminLoader,
  ballotAction,
  ballotLoader,
  guestLoader,
  landingLoader,
  loginAction,
  logoutAction,
  registerAction,
  rootLoader,
} from "./lib/data.js";
import Admin from "./pages/Admin.jsx";
import Ballot from "./pages/Ballot.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";

export const router = createBrowserRouter([
  {
    id: "root",
    loader: rootLoader,
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      { path: "login", element: <Login />, loader: guestLoader, action: loginAction },
      { path: "register", element: <Register />, loader: guestLoader, action: registerAction },
      { path: "logout", action: logoutAction, loader: () => redirect("/") },
      {
        element: <Shell />,
        children: [
          { index: true, element: <Landing />, loader: landingLoader },
          { path: "ballot", element: <Ballot />, loader: ballotLoader, action: ballotAction },
          { path: "admin", element: <Admin />, loader: adminLoader, action: adminAction },
          { path: "votingPage", loader: () => redirect("/ballot") },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
