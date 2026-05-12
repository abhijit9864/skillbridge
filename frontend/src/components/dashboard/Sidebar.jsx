import "../styles/dashboard.css";

import {
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaBullhorn,
  FaTasks,
  FaUsers,
  FaClipboardList,
  FaCertificate,
  FaMoneyBill,
  FaWallet,
  FaFileInvoice,
  FaEnvelope,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  return (
    <aside className="sidebar">
      {/* <div className="sidebar-logo">
        SkillBridge
      </div> */}

      <ul className="sidebar-menu">
        <li>
          <FaTachometerAlt />
          Dashboard
        </li>

        <li>
          <FaUser />
          My Profile
        </li>

        <li onClick={() => (window.location.href = "/dashboard/courses")}>
          <FaBook />
          Courses
        </li>

        <li>
          <FaBullhorn />
          Announcements
        </li>

        <li>
          <FaTasks />
          Assignments
        </li>

        {role === "ADMIN" && (
          <li>
            <FaUsers />
            Students
          </li>
        )}

        <li>
          <FaClipboardList />
          Quiz
        </li>

        <li>
          <FaClipboardList />
          Quiz Results
        </li>

        <li>
          <FaCertificate />
          Certificates
        </li>

        {role === "ADMIN" && (
          <>
            <li>
              <FaMoneyBill />
              Earnings
            </li>

            <li>
              <FaWallet />
              Payout
            </li>

            <li>
              <FaFileInvoice />
              Statements
            </li>
          </>
        )}

        <li>
          <FaEnvelope />
          Messages
        </li>

        <li>
          <FaHeadset />
          Support Tickets
        </li>

        <li className="logout-item">
          <FaSignOutAlt />
          Logout
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
