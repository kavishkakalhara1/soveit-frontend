import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiChartPie, HiClock } from "react-icons/hi";
import { GiVendingMachine } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountTree, MdOutlineInventory, MdOutlineVerifiedUser } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        // console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in"); // Redirect to sign in page
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const renderSalesSidebar = () => (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1 ">
          {/* <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link> */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile" ? true : false}
              icon={HiUser}
              label={"Admin"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=issues">
            <Sidebar.Item
              active={tab === "issues" ? true : false}
              icon={IoSettingsOutline}
              labelColor="dark"
              as="div"
            >
              Issues
            </Sidebar.Item>
          </Link>
     
    
          <Link to="/dashboard?tab=history">
            <Sidebar.Item
              active={tab === "history" ? true : false}
              icon={MdOutlineInventory}
              labelColor="dark"
              as="div"
            >
              History
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users" ? true : false}
              icon={MdOutlineAccountTree}
              labelColor="dark"
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );

  return (
    <div className="fixed rounded-tr-3xl">
      {currentUser?.section === "maintenance"
        ? renderMaintenanceSidebar()
        : currentUser?.section === "maintenance"
        ? renderProductionSidebar(): renderSalesSidebar()}
    </div>
  );
}
