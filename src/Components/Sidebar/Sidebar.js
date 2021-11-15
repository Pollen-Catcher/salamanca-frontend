import  React from 'react';
import { useState } from 'react';
import styles from './Sidebar.css';

function Sidebar() {
  const [active, setMode] = useState(false);
  const ToggleMode = () => {
    setMode(!active);
  };
  return(
    <div className='Sidebar'>
      <div className={active ? "icon iconActive":"icon"} onClick={ToggleMode}>
        <div className = 'hamburguer hamburguerIcon'></div>
      </div>
      <div className={active ? "menu menuOpen" : "menu menuClose"}>
        <div className='list'>
          <div className='listItems'>
            <p className="circle">Home</p>
            <p className="circle">Login</p>
            <p className="circle">Profile</p>
            <p className="circle">Worksheet</p>
            <p className="circle">About Us</p>
            <p className="circle">Log Out</p>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Sidebar;


