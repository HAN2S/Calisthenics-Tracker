import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

interface SideNavProps {
  isOpen: boolean;
  toggleNav: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, toggleNav }) => {
  return (
    <>
      <button className="nav-toggle" onClick={toggleNav}>
        {isOpen ? (
          <svg
            className="toggle-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="toggle-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      <nav className={`side-nav ${isOpen ? '' : 'closed'}`}>
        <ul>
          <li>
            <span className="disabled-link">Dashboard (Coming Soon)</span>
          </li>
          <li>
            <NavLink to="/training" className={({ isActive }) => (isActive ? 'active' : '')} end>
              Training
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideNav;