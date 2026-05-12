import DashboardLayout from "../../layout/DashboardLayout";

function DashboardHome() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <DashboardLayout>

      <h1>
        Welcome, {user?.name}
      </h1>

      <p>
        Role: {user?.role}
      </p>

      <p>
        Organization:
        {user?.organizationName}
      </p>

    </DashboardLayout>
  );
}

export default DashboardHome;