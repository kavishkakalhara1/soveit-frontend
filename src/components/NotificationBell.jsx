import React from "react";
import { FaBell } from "react-icons/fa";

const NotificationBell = ({ unreadCount, onClick }) => {
  return (
    <div style={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
      <FaBell size={24} />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 6px",
            fontSize: "12px",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
