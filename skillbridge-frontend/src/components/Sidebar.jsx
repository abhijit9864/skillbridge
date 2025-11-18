import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaFileInvoice,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaChevronDown,
  FaTachometerAlt,
  FaChartPie,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userInitial, setUserInitial] = useState("U");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("name");
    if (userName) {
      const extractedName = userName.split("@")[0];
      setUserInitial(extractedName.charAt(0).toUpperCase());
      setUserName(extractedName
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
      );
    }
  }, []);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="user-profile">
          <div className="user-icon">{userInitial}</div>
          <div className="user-name">{userName}</div>
        </div>
      </div>
      <nav className="menu">
        <ul>
          {/* Dashboard Section */}
          <li>
            <button onClick={() => toggleMenu("dashboard")}>
              <FaTachometerAlt /> Dashboard
              <FaChevronDown className={activeMenu === "dashboard" ? "rotate" : ""} />
            </button>
            <ul className={`submenu ${activeMenu === "dashboard" ? "show" : ""}`}>
              <li><Link to="/all-users" style={{color:"#fff", textDecoration:"none"}}><FaUser /> Users</Link></li>
              <li><Link to="/invoice" style={{color:"#fff", textDecoration:"none"}}><FaFileInvoice /> Invoice</Link></li>
            </ul>
          </li>

          {/* Content Section */}
          <li>
            <button onClick={() => toggleMenu("content")}>
              <FaChartBar /> Content
              <FaChevronDown className={activeMenu === "content" ? "rotate" : ""} />
            </button>
            <ul className={`submenu ${activeMenu === "content" ? "show" : ""}`}>
              <li><Link to="/courselist "style={{color:"#fff", textDecoration:"none"}}>Create Course</Link></li>
              <li><Link to="/live-course"style={{color:"#fff", textDecoration:"none"}}>Live Course</Link></li>
            </ul>
          </li>

          {/* Controller Section (Added Manage Team Here) */}
          <li>
            <button onClick={() => toggleMenu("controller")}>
              <FaUsers /> Controller
              <FaChevronDown className={activeMenu === "controller" ? "rotate" : ""} />
            </button>
            <ul className={`submenu ${activeMenu === "controller" ? "show" : ""}`}>
              <li><Link to="/manage-team"style={{color:"#fff", textDecoration:"none"}}><FaUsers /> Manage Team</Link></li>
            </ul>
          </li>

          {/* Analytics Section */}
          <li>
            <button onClick={() => toggleMenu("analytics")}>
              <FaChartPie /> Analytics
              <FaChevronDown className={activeMenu === "analytics" ? "rotate" : ""} />
            </button>
            <ul className={`submenu ${activeMenu === "analytics" ? "show" : ""}`}>
              <li><Link to="/UserActivity"style={{color:"#fff", textDecoration:"none"}}>User Activity</Link></li>
              <li><Link to="/order-analytics"style={{color:"#fff", textDecoration:"none"}}>Order Analytics</Link></li>
            </ul>
          </li>

          {/* Logout */}
          <li>
            <button className="logout-btn" onClick={handleLogout}>
               Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
