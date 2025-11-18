import { useEffect } from 'react';
import './App.css';
import Router from './router/router';
import { BrowserRouter } from 'react-router-dom';

function App() {
  useEffect(() => {
    document.body.classList.add("light-theme"); // Ensure light theme is applied globally
  }, []);

  return (
    <BrowserRouter>
      <div className="App light-theme"> {/* Always set light theme */}
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
