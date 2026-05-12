// import { useEffect, useState } from "react";
// import { FaMoon, FaSun } from "react-icons/fa";

// function ThemeToggle() {
//   const [dark, setDark] = useState(false);

//   useEffect(() => {
//     const root = document.documentElement;

//     if (dark) {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }
//   }, [dark]);

//   return (
//     <button
//       onClick={() => setDark(!dark)}
//       className="theme-toggle"
//     >
//       {dark ? <FaSun /> : <FaMoon />}
//     </button>
//   );
// }

// export default ThemeToggle;

import { useEffect, useState } from "react";

import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {

  // SYSTEM THEME DETECT
  const getSystemTheme = () => {

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  };

  const [dark, setDark] = useState(getSystemTheme());

  // APPLY THEME
  useEffect(() => {

    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

  }, [dark]);

  // LISTEN SYSTEM THEME CHANGE
  useEffect(() => {

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = (e) => {
      setDark(e.matches);
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {

      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };

  }, []);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="theme-toggle"
    >

      {dark ? <FaSun /> : <FaMoon />}

    </button>
  );
}

export default ThemeToggle;