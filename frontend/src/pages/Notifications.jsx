import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaBell,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/notifications.css";
import DashboardLayout from "../layout/DashboardLayout";

const API_URL =
  import.meta.env.VITE_API_URL;

function Notifications() {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role;

  const [notifications,
    setNotifications] =
    useState([]);

  const [users,
    setUsers] =
    useState([]);

  const [messageForm,
    setMessageForm] =
    useState({

      userId: "",

      title: "",

      message: "",
    });

  /* FETCH */

  useEffect(() => {

    fetchNotifications();

    if (
      role === "ADMIN" ||
      role === "SUPERADMIN"
    ) {

      fetchUsers();
    }

  }, []);

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

  /* USERS */

  const fetchUsers =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/users`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setUsers(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  /* MARK READ */

  const handleRead =
    async (id) => {

      try {

        await axios.put(
          `${API_URL}/api/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchNotifications();

      } catch (error) {

        console.log(error);
      }
    };

  /* SEND MESSAGE */

  const handleSend =
    async () => {

      try {

        await axios.post(
          `${API_URL}/api/notifications/send`,
          messageForm,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Message Sent"
        );

        setMessageForm({

          userId: "",

          title: "",

          message: "",
        });

      } catch (error) {

        console.log(error);
      }
    };

  /* FILTER */

  const systemNotifications =
    notifications.filter(
      (n) =>
        n.type === "SYSTEM" ||
        n.type === null
    );

  const personalNotifications =
    notifications.filter(
      (n) =>
        n.type === "PERSONAL"
    );

  return (
    <DashboardLayout>

    <div className="notifications-page">

      {/* LEFT */}

      <div className="notifications-left">

        {/* SYSTEM */}

        <div className="notification-section">

          <h2>

            <FaBell />

            System Notifications

          </h2>

          {systemNotifications.map(
            (item) => (

              <div
                key={item.id}
                className={`notification-card ${
                  item.isRead
                    ? "read-card"
                    : ""
                }`}
              >

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.message}
                  </p>

                  {item.rejectionReason && (

                    <div className="reason-box">

                      Reason:
                      {" "}
                      {
                        item.rejectionReason
                      }

                    </div>
                  )}

                  <span>

                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                  </span>

                </div>

                {!item.isRead && (

                  <button
                    onClick={() =>
                      handleRead(
                        item.id
                      )
                    }
                  >

                    <FaCheckCircle />

                  </button>
                )}

              </div>
            )
          )}

        </div>

        {/* PERSONAL */}

        <div className="notification-section">

          <h2>

            <FaUser />

            Personal Messages

          </h2>

          {personalNotifications.map(
            (item) => (

              <div
                key={item.id}
                className={`notification-card ${
                  item.isRead
                    ? "read-card"
                    : ""
                }`}
              >

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.message}
                  </p>

                  <span>

                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                  </span>

                </div>

                {!item.isRead && (

                  <button
                    onClick={() =>
                      handleRead(
                        item.id
                      )
                    }
                  >

                    <FaCheckCircle />

                  </button>
                )}

              </div>
            )
          )}

        </div>

      </div>

      {/* RIGHT */}

      {(role === "ADMIN" ||
        role ===
          "SUPERADMIN") && (

        <div className="notifications-right">

          <h2>
            Send Message
          </h2>

          <select
            value={
              messageForm.userId
            }
            onChange={(e) =>
              setMessageForm({
                ...messageForm,
                userId:
                  e.target.value,
              })
            }
          >

            <option value="">
              Select User
            </option>

            {users.map((u) => (

              <option
                key={u.id}
                value={u.id}
              >

                {u.name}

              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Title"
            value={
              messageForm.title
            }
            onChange={(e) =>
              setMessageForm({
                ...messageForm,
                title:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Message"
            value={
              messageForm.message
            }
            onChange={(e) =>
              setMessageForm({
                ...messageForm,
                message:
                  e.target.value,
              })
            }
          />

          <button
            onClick={
              handleSend
            }
          >

            Send Message

          </button>

        </div>
      )}

    </div>
    </DashboardLayout>
  );
}

export default Notifications;