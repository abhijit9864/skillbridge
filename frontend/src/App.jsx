import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Landingpage from "./pages/Landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MainLayout from "./layout/MainLayout";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* GLOBAL LAYOUT */}
        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Landingpage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;