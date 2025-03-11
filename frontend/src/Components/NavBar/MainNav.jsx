import React, { useState, useEffect } from 'react';
import '../../css/NavBar/MainNav.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from 'react-router-dom';

const MainNav = () => {
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000); // Initial check for mobile view
  const [user, setUser] = useState(null); // State to store user data

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userRole'));
    setUser(storedUser);
  }, []); // Empty dependency array ensures this runs only once

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1000);
      if (!isMobileView) {
        setIsToggled(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileView]);

  return (
    <div className='MainNavDiv'>
      <div className="Logo">
        <h3>DUTIO</h3>
      </div>

      {/* Navigation Menu */}
      <ul className={isMobileView && isToggled ? 'menu-mobile' : 'menu-web'}>
        <li className={location.pathname === `/${user}/dashboard`? 'LinkActive' : ''}>
          <Link className='NavLinks' to={`/${user}/dashboard`}>Home</Link>
        </li >
        <li className={location.pathname === `/${user}/room`? 'LinkActive' : ''}>
          <Link className='NavLinks' to={`/${user}/room`}>Room</Link>
        </li>
        <li className={location.pathname === `/${user}/leave/pending`? 'LinkActive' : ''}>
          <Link className='NavLinks' to={`/${user}/leave/pending`}>Leave</Link>
        </li>
        <li className={location.pathname === `/${user}/chat`? 'LinkActive' : ''}>
          <Link className='NavLinks' to={`/${user}/chat`}>ChatBox</Link>
        </li>
        <li className={location.pathname === `/contact`? 'LinkActive' : ''}>
          <Link className='NavLinks' to={`/contact`}>Contact</Link>
        </li>
      </ul>

      {/* Hamburger Menu Button for Mobile View */}
      {isMobileView && (
        <button className='Ham_menu' onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>
      )}
    </div>
  );
};

export default MainNav;
