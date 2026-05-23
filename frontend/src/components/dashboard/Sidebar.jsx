import "../styles/dashboard.css";

import Swal from "sweetalert2";

import {
  FaTachometerAlt,
  FaBook,
  FaTasks,
  FaUsers,
  FaClipboardList,
  FaCertificate,
  FaMoneyBill,
  FaWallet,
  FaFileInvoice,
  FaHeadset,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  // LOGOUT FUNCTION
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out",
      timer: 1500,
      showConfirmButton: false,
    });

    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">

      <ul className="sidebar-menu">

        <li onClick={() => (window.location.href = "/dashboard")}>
          <FaTachometerAlt />
          Dashboard
        </li>

        <li onClick={() => (window.location.href = "/dashboard/courses")}>
          <FaBook />
          Courses
        </li>

        <li onClick={() => (window.location.href = "/dashboard/assignments")}>
          <FaTasks />
          Assignments
        </li>

        {role !== "STUDENT" && (
          <li onClick={() => (window.location.href = "/dashboard/students")}>
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

        {role !== "STUDENT" && (
          <li
            onClick={() =>
              window.location.href =
              "/dashboard/notifications"
            }
          >

            <FaBell />

            Notifications

          </li>
        )}

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
          <FaHeadset />
          Support Tickets
        </li>

        <li
          className="logout-item"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;