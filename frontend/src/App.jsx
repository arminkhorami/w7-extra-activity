import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddPropertyPage from "./pages/AddPropertyPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const App = () => {
  // state کاربر
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={user ? <Home user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-property"
              element={user ? <AddPropertyPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<LoginForm setUser={setUser} />}
            />
            <Route
              path="/signup"
              element={<SignupForm setUser={setUser} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;