//import React from 'react';
import Sidebar from './Sidebar';
import GraphAndTable from './GraphAndTable';
import './Organization-admini.css';
import Navbar from '../landingPage/navbar';
import PropTypes from 'prop-types';

const OrganizationAdmin = ({ theme, toggleTheme }) => {
  return (
    <>
    <Navbar></Navbar>
    <div className={`organization-admin ${theme ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div className="content-container">
        <GraphAndTable theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
    </>
  );
};

OrganizationAdmin.propTypes = {
  theme: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default OrganizationAdmin;

