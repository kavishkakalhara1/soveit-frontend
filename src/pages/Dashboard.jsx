import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { Button } from "flowbite-react";
import DashUsers from "./DashUsers";
import DashIssues from "../components/DashIssues";
import DashHistory from "../components/DashHistory";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [sidebarTabVisible, setSidebarTabVisible] = useState(true);



  const toggleSidebarTab = () => {
    setSidebarTabVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const machineIdFromUrl = urlParams.get("machineId");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (machineIdFromUrl) {
      setMachineId(machineIdFromUrl);
    }
  }, [location.search]);

 
  return (
    <div className="flex flex-col min-h-screen mt-10 overflow-x-auto md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <Button onClick={toggleSidebarTab} className="focus:ring-0"></Button>
        {sidebarTabVisible && (
          <div className="sidebar">
          
              <DashSidebar />
        
          </div>
        )}
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {tab === "issues" && <DashIssues/>}
      {tab === "history" && <DashHistory />}
      {tab === "users" && <DashUsers />}
    </div>
  );
}
