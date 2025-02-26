import {
  BrowserRouter,
  Routes,
  Route,
  useBeforeUnload,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import React, { useEffect, useState } from "react";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { requestFCMToken } from "./firebase";
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Home from "./pages/Home";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  useEffect(() => {
    const getToken = async () => {
      const token = await requestFCMToken();
      // console.log("Device Token:", token);
      // You can send this token to your backend for testing
    };

    getToken();
  }, []);

  useEffect(() => {
    requestFCMToken();
    onMessage(messaging, (payload) => {
      setNotifications((prev) => [...prev, payload.notification]); // Store in state
      // Extract notification details
      const { title, body, image } = payload.notification;
      toast(
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {image && (
            <img
              src={image}
              alt="Notification"
              style={{ width: "40px", height: "30px", borderRadius: "5px" }}
            />
          )}
          <div>
            <strong style={{ fontSize: "14px", display: "block" }}>
              {title}
            </strong>
            <span style={{ fontSize: "12px" }}>{body}</span>
          </div>
        </div>,
        {
          style: {
            borderRadius: "10px",
            background: "red",
            color: "#fff",
            padding: "10px",
            minWidth: "250px",
          },
        }
      );
    });
  }, []);

  return (
    <BrowserRouter>
      <Header/>
      <Toaster position="top-right" />
      <ScrollToTop />
      <AnimatedRoutes />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route element={<PrivateRoute />}></Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          {/* Add admin routes here if needed */}
        </Route>

        
        {/* For all other routes, if no currentUser, redirect to SignIn */}
     
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
