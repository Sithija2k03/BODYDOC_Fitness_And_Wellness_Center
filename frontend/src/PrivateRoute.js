// // src/PrivateRoute.js

// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const isAuthenticated = // Add your authentication check logic here
//     localStorage.getItem("authToken"); // Example: check if user is authenticated

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export { PrivateRoute };


import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Changed from authToken to token

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export { PrivateRoute };