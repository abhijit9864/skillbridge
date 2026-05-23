// import "../styles/navbar.css";

// import { useNavigate } from "react-router-dom";

// import ThemeToggle from "./ThemeToggle";

// import Swal from "sweetalert2";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   connectSocket,
//   disconnectSocket,
// } from "../utils/socket";

// import {
//   FaUser,
//   FaSignInAlt,
//   FaGraduationCap,
//   FaBell,
// } from "react-icons/fa";

// function Navbar() {

//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const token = localStorage.getItem("token");

//   const role = user?.role;

//   const scrollToSection = (id) => {

//     const section = document.getElementById(id);

//     if (section) {

//       section.scrollIntoView({
//         behavior: "smooth",
//       });
//     }
//   };

//   // LOGOUT FUNCTION
//   const handleLogout = () => {

//     localStorage.removeItem("token");

//     localStorage.removeItem("user");

//     Swal.fire({
//       icon: "success",
//       title: "Logout Successful",
//       text: "You have been logged out",
//       timer: 1500,
//       showConfirmButton: false,
//     });

//     navigate("/login");
//   };

//   // FIRST LETTER
//   const firstLetter = user?.name
//     ? user.name.charAt(0).toUpperCase()
//     : "U";

//   const [notificationCount,
//     setNotificationCount] =
//     useState(0);

//   const [notifications,
//     setNotifications] =
//     useState([]);

//   useEffect(() => {

//     if (!user?.id) return;

//     connectSocket(
//       user.id,
//       (notification) => {

//         console.log(
//           "New Notification:",
//           notification
//         );

//         setNotifications(
//           (prev) => [
//             notification,
//             ...prev,
//           ]
//         );

//         setNotificationCount(
//           (prev) => prev + 1
//         );

//         /* OPTIONAL POPUP */

//         Swal.fire({
//           toast: true,
//           position: "top-end",
//           icon: "info",
//           title:
//             notification.message,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//       }
//     );

//     return () => {

//       disconnectSocket();
//     };

//   }, []);

//   return (
//     <nav className="navbar">

//       {/* LEFT */}
//       <div className="logo-section">

//         <FaGraduationCap className="logo-icon" />

//         <div className="logo-text">

//           <span className="brand">
//             SkillBridge
//           </span>

//           <span className="sub">
//             LMS
//           </span>

//         </div>

//       </div>

//       {/* CENTER */}
//       {!token && (
//         <ul className="nav-links">

//           <li onClick={() => scrollToSection("hero")}>
//             Home
//           </li>

//           <li onClick={() => scrollToSection("benefits")}>
//             Benefits
//           </li>

//           <li onClick={() => scrollToSection("community")}>
//             Community
//           </li>

//           <li onClick={() => scrollToSection("workflow")}>
//             Workflow
//           </li>

//           <li onClick={() => scrollToSection("pricing")}>
//             Pricing
//           </li>

//           <li onClick={() => scrollToSection("faq")}>
//             FAQ
//           </li>

//         </ul>
//       )}

//       {/* RIGHT */}
//       <div className="nav-actions">

//         <ThemeToggle />

//         {!token ? (
//           <>
//             <button
//               className="login-btn"
//               onClick={() => navigate("/login")}
//             >

//               <FaSignInAlt />

//               Login

//             </button>

//             <button
//               className="signup-btn"
//               onClick={() => navigate("/register")}
//             >

//               <FaUser />

//               Sign Up

//             </button>
//           </>
//         ) : (
//           <div className="user-section">

//             {(role === "ADMIN" ||
//               role === "SUPERADMIN" ||
//               role === "INSTRUCTOR") && (

//                 <div
//                   className="notification-icon"
//                   onClick={() =>
//                     navigate("/dashboard/notifications")
//                   }
//                 >

//                   <FaBell />

//                   {notificationCount > 0 && (

//                     <span className="notification-badge">

//                       {notificationCount}

//                     </span>
//                   )}

//                 </div>
//               )}

//             {/* USER NAME */}
//             <span className="user-name">
//               {user?.name}
//             </span>

//             {/* USER AVATAR */}
//             <div
//               className="user-avatar"
//               onClick={() => navigate("/dashboard")}
//             >
//               {firstLetter}
//             </div>

//           </div>
//         )}

//       </div>

//     </nav>
//   );
// }

// export default Navbar;

import "../styles/navbar.css";

import { useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

import Swal from "sweetalert2";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  connectSocket,
  disconnectSocket,
} from "../utils/socket";

import {
  FaUser,
  FaSignInAlt,
  FaGraduationCap,
  FaBell,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL;

function Navbar() {

  const navigate =
    useNavigate();

  const dropdownRef =
    useRef(null);

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const token =
    localStorage.getItem(
      "token"
    );

  const role =
    user?.role;

  const [notificationCount,
    setNotificationCount] =
    useState(0);

  const [notifications,
    setNotifications] =
    useState([]);

  const [showDropdown,
    setShowDropdown] =
    useState(false);

  /* SCROLL */

  const scrollToSection =
    (id) => {

      const section =
        document.getElementById(
          id
        );

      if (section) {

        section.scrollIntoView({
          behavior:
            "smooth",
        });
      }
    };

  /* LOGOUT */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      Swal.fire({
        icon: "success",
        title:
          "Logout Successful",
        text:
          "You have been logged out",
        timer: 1500,
        showConfirmButton:
          false,
      });

      navigate("/login");
    };

  /* FIRST LETTER */

  const firstLetter =
    user?.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "U";

  /* FETCH NOTIFICATIONS */

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/notifications`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setNotifications(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  /* FETCH COUNT */

  const fetchUnreadCount =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/notifications/unread-count`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setNotificationCount(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  /* SOCKET */

  useEffect(() => {

    if (!user?.id) return;

    fetchNotifications();

    fetchUnreadCount();

    connectSocket(
      user.id,
      (notification) => {

        setNotifications(
          (prev) => [
            notification,
            ...prev,
          ]
        );

        setNotificationCount(
          (prev) => prev + 1
        );

        Swal.fire({
          toast: true,
          position:
            "top-end",
          icon: "info",
          title:
            notification.message,
          showConfirmButton:
            false,
          timer: 3000,
        });
      }
    );

    return () => {

      disconnectSocket();
    };

  }, []);

  /* OUTSIDE CLICK */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setShowDropdown(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (

    <nav className="navbar">

      {/* LEFT */}

      <div className="logo-section">

        <FaGraduationCap className="logo-icon" />

        <div className="logo-text">

          <span className="brand">

            SkillBridge

          </span>

          <span className="sub">

            LMS

          </span>

        </div>

      </div>

      {/* CENTER */}

      {!token && (

        <ul className="nav-links">

          <li
            onClick={() =>
              scrollToSection(
                "hero"
              )
            }
          >

            Home

          </li>

          <li
            onClick={() =>
              scrollToSection(
                "benefits"
              )
            }
          >

            Benefits

          </li>

          <li
            onClick={() =>
              scrollToSection(
                "community"
              )
            }
          >

            Community

          </li>

          <li
            onClick={() =>
              scrollToSection(
                "workflow"
              )
            }
          >

            Workflow

          </li>

          <li
            onClick={() =>
              scrollToSection(
                "pricing"
              )
            }
          >

            Pricing

          </li>

          <li
            onClick={() =>
              scrollToSection(
                "faq"
              )
            }
          >

            FAQ

          </li>

        </ul>
      )}

      {/* RIGHT */}

      <div className="nav-actions">

        <ThemeToggle />

        {!token ? (

          <>
            <button
              className="login-btn"
              onClick={() =>
                navigate(
                  "/login"
                )
              }
            >

              <FaSignInAlt />

              Login

            </button>

            <button
              className="signup-btn"
              onClick={() =>
                navigate(
                  "/register"
                )
              }
            >

              <FaUser />

              Sign Up

            </button>
          </>

        ) : (

          <div className="user-section">

            {(role === "ADMIN" ||
              role ===
                "SUPERADMIN" ||
              role ===
                "INSTRUCTOR") && (

              <div
                className="notification-wrapper"
                ref={dropdownRef}
              >

                {/* BELL */}

                <div
                  className="notification-icon"
                  onClick={() =>
                    setShowDropdown(
                      !showDropdown
                    )
                  }
                >

                  <FaBell />

                  {notificationCount >
                    0 && (

                    <span className="notification-badge">

                      {
                        notificationCount
                      }

                    </span>
                  )}

                </div>

                {/* DROPDOWN */}

                {showDropdown && (

                  <div className="notification-dropdown">

                    <div className="dropdown-top">

                      <h3>

                        Notifications

                      </h3>

                    </div>

                    {notifications
                      .slice(0, 5)
                      .map(
                        (
                          item
                        ) => (

                          <div
                            key={
                              item.id
                            }
                            className={`dropdown-notification ${
                              !item.isRead
                                ? "unread-dropdown"
                                : ""
                            }`}
                          >

                            <h4>

                              {
                                item.title
                              }

                            </h4>

                            <p>

                              {
                                item.message
                              }

                            </p>

                          </div>
                        )
                      )}

                    {notifications
                      .length ===
                      0 && (

                      <div className="empty-notification">

                        No notifications

                      </div>
                    )}

                    <button
                      className="see-more-btn"
                      onClick={() =>
                        navigate(
                          "/dashboard/notifications"
                        )
                      }
                    >

                      See More

                    </button>

                  </div>
                )}

              </div>
            )}

            {/* USER */}

            <span className="user-name">

              {user?.name}

            </span>

            <div
              className="user-avatar"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >

              {firstLetter}

            </div>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;