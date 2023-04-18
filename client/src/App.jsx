import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import AuthProvider from "./components/AuthProvider";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import RefreshRedirect from "./components/RefreshRedirect";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              element={
                <RefreshRedirect>
                  <Login />
                </RefreshRedirect>
              }
              path="/"
            />
            <Route element={<Register />} path="/register" />
            <Route
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              path="/dashboard"
            />
            <Route element={<Login />} path="*" />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
