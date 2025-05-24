import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar(){
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return(
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-indigo-900 text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            <div id="sidebar" className={`fixed w-64 h-full bg-indigo-900 text-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-10`}>
        <div className="p-6">
          <h1 className="text-2xl font-semibold">AirQuality Dashboard</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <NavLink
              to="/"
              className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="w-6 h-6 mr-3"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
              Overview
            </NavLink>
            <NavLink
              to="/ml"
              className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="w-6 h-6 mr-3"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>
              ML Model
            </NavLink>
            <NavLink
              to="/login"
              className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className="w-6 h-6 mr-3" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
              Logout
            </NavLink>
          </div>
        </nav>
      </div>
        </>
    )
}

export default Sidebar;