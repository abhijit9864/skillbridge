import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaSearch,
  FaUsers,
  FaEnvelope,
  FaBuilding,
  FaUserShield,
} from "react-icons/fa";

import "../styles/studentinfo.css";

const API_URL =
  import.meta.env.VITE_API_URL;

const StudentInfo = () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const token =
    localStorage.getItem("token");

  const role =
    user?.role;

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [totalPages,
    setTotalPages] =
    useState(1);

  /* FETCH USERS */

  useEffect(() => {

    fetchUsers();

  }, [page, search]);

  const fetchUsers = async () => {

    try {

      setLoading(true);

      let response;

      /* INSTRUCTOR */

      if (
        role === "INSTRUCTOR"
      ) {

        response =
          await axios.get(
            `${API_URL}/api/users/students?page=${page}&size=10&search=${search}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setUsers(
          response.data.content
        );

        setTotalPages(
          response.data.totalPages
        );

      }

      /* ADMIN */

      else if (
        role === "ADMIN"
      ) {

        response =
          await axios.get(
            `${API_URL}/api/users`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        let filtered =
          response.data;

        if (search) {

          filtered =
            filtered.filter(
              (item) =>
                item.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
            );
        }

        setUsers(filtered);
      }

      /* SUPER ADMIN */

      else if (
        role ===
        "SUPER_ADMIN"
      ) {

        response =
          await axios.get(
            `${API_URL}/api/users`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        let filtered =
          response.data;

        if (search) {

          filtered =
            filtered.filter(
              (item) =>
                item.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
            );
        }

        setUsers(filtered);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="student-page">

      {/* TOP */}

      <div className="student-top">

        <div>

          <h1>

            <FaUsers />

            User Management

          </h1>

          <p>
            Manage all platform users
          </p>

        </div>

        {/* SEARCH */}

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="student-table-wrapper">

        {loading ? (

          <div className="loading-box">

            Loading...

          </div>

        ) : users.length === 0 ? (

          <div className="loading-box">

            No users found

          </div>

        ) : (

          <table className="student-table">

            <thead>

              <tr>

                <th>User</th>

                <th>Email</th>

                <th>Organization</th>

                <th>Role</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {users.map((item) => (

                <tr key={item.id}>

                  {/* USER */}

                  <td>

                    <div className="user-info">

                      {item.profileImageUrl ? (

                        <img
                          src={`${API_URL}/${item.profileImageUrl}`}
                          alt="profile"
                          className="profile-img"
                        />

                      ) : (

                        <div className="profile-placeholder">

                          {item.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>
                      )}

                      <span>
                        {item.name}
                      </span>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td>

                    <div className="table-icon">

                      <FaEnvelope />

                      {item.email}

                    </div>

                  </td>

                  {/* ORG */}

                  <td>

                    <div className="table-icon">

                      <FaBuilding />

                      {item.organizationName ||
                        "N/A"}

                    </div>

                  </td>

                  {/* ROLE */}

                  <td>

                    <span className={`role-badge ${item.role}`}>

                      <FaUserShield />

                      {item.role}

                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span className={`status-badge ${item.status}`}>

                      {item.status}

                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* PAGINATION */}

      {role === "INSTRUCTOR" && (

        <div className="pagination">

          <button
            disabled={page === 0}
            onClick={() =>
              setPage(page - 1)
            }
          >

            Previous

          </button>

          <span>

            Page {page + 1} of{" "}
            {totalPages}

          </span>

          <button
            disabled={
              page + 1 ===
              totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
          >

            Next

          </button>

        </div>
      )}

    </div>
  );
};

export default StudentInfo;