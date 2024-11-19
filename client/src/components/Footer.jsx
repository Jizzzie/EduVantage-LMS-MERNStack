import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./footer.scss";
const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="shadow py-1 navy-color fixed-footer">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center py-1 px-5 margin-0">
          <p className="col-md-6 mb-0 text-white">© 2024 eduVantage. All rights reserved</p>
          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item"><a href="/home" className="nav-link px-2 text-white">Home</a></li>
            <li className="nav-item"><a href="/upload" className="nav-link px-2 text-white">Upload</a></li>
            <li className="nav-item"><a href="/saved" className="nav-link px-2 text-white">Saved Videos</a></li>
            <li className="nav-item"><a href="/myvideos" className="nav-link px-2 text-white">Your Videos</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
