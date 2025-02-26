import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { messaging } from "../firebase";
import { onMessage } from "firebase/messaging";
import axios from "axios";
import toast from "react-hot-toast";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/notification/get-notifications`
  //     )
  //     .then((res) => {
  //       setNotifications(res.data.slice(-10)); // Show only last 10 notifications
  //     });
  // }, []);

  const handleNotificationClick = () => {
    // Mark all as seen
    setSeenNotifications(
      notifications.map((notification) => notification.title)
    );
  };

  const handleNotificationItemClick = (notification) => {
    setSeenNotifications((prev) => [...prev, notification.title]);
  };

  // Ensure unseen notifications filter correctly
  const unseenNotifications = notifications.filter(
    (notification) => !seenNotifications.includes(notification.title)
  );

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload.notification);
      setNotifications((prev) => [...prev, payload.notification]); // Store in state
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
            background: "#333",
            color: "red",
            padding: "10px",
            minWidth: "250px",
          },
        }
      );
    });
  }, []);

  const handleSignout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`
      );

      if (res.status !== 200) {
        // Fix: Corrected condition
        console.log("Signout failed");
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in"); // Redirect to sign-in page
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="fixed top-0 z-50 flex w-full">
      <div className="flex justify-between w-full py-3 mx-auto bg-white shadow-xl ">
        {/* <img src={logo} alt="" width={150} className="flex my-auto ml-5" /> */}
        <Link to={"/"}>
          <h1 className="content-center ml-20 text-3xl font-semibold">
            {" "}
            <span className="font-normal text-primary">Solve</span>IT
          </h1>
        </Link>

        <div className="flex ">
          {/* <Dropdown
            arrowIcon={false}
            inline
            label={
              <NotificationBell
                unreadCount={unseenNotifications.length}
                onClick={handleNotificationClick}
              />
            }
          >
            {notifications.length > 0 ? (
              notifications
                .slice()
                .reverse()
                .map((notification, index) => (
                  <Dropdown.Item
                    key={index}
                    className={`border-b-2 ${
                      unseenNotifications.find(
                        (n) => n.title === notification.section
                      )
                        ? "bg-gray-100 font-bold"
                        : "text-gray-500"
                    }`}
                    onClick={() => handleNotificationItemClick(notification)}
                  >
                    <p>
                      <strong>{notification.section}: &nbsp;</strong>
                    </p>
                    <p>{notification.content}</p>
                    <p className="text-xs text-gray-400">
                      {" "}
                      &nbsp; at &nbsp;
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </Dropdown.Item>
                ))
            ) : (
              <Dropdown.Item className="text-center text-gray-500">
                No new notifications
              </Dropdown.Item>
            )}
          </Dropdown> */}
        </div>
        <div className="mr-10">
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profileImage} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm text-gray-400">
                  {currentUser.trend2}
                </span>
                <span className="block text-sm">
                  {currentUser.firstname} {currentUser.lastname}
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button className=" bg-primary hover:bg-secondary ring-0 focus:ring-transparent">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
