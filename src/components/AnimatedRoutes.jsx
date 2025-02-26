import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
