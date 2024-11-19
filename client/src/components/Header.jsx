import { useEffect, useState } from "react";
import Logo from "../assets/codecampus-logo/png/logo_black.png";
import SearchIcon from "../assets/search.png";
import { useLocation, useNavigate } from "react-router-dom";


const Header = ({ searchInp, setSearchInp, handleSearch, setIsFocus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const [isSearch, setIsSearch] = useState(false);

  async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    navigate('/login');
  }

  const navigateToUpload = () => {
    // You can add conditions or checks before navigating if needed
    navigate('/pages/UploadPass');
  };

  useEffect(() => {
    // console.log(pathName);
    if (pathName == '/home') setIsSearch(true);
    else setIsSearch(false);
  }, [])

  return <header className="p-2 text-white shadow stick-to-top  ">
    <div className="container ">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between mx-3">
        <a href="/home" className="d-flex align-items-center mb-lg-0 text-white text-decoration-none">
          <img className="logo me-5" src={Logo}></img>
        </a>
        <div className="d-flex">
          {isSearch && <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <div className="input-group">
              <input type="search" className="form-control form-control-dark" placeholder="Search videos" aria-label="Search" value={searchInp} onChange={(e) => setSearchInp(e.target.value)} />
              <div className="input-group-append">
                <button className="btn secondary-button search-btn" type="button" onClick={handleSearch}>
                  <img id="search-icon" src={SearchIcon} />
                </button>
              </div>
            </div>
          </form>}
          <div className="text-end">
            <div className="dropdown">
              <button className="btn secondary-button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {localStorage.getItem('name') && localStorage.getItem('name').split(' ')[0]}
              </button>
              <ul className="dropdown-menu dropdown-menu-dark p-0 overflow-hidden fs-7">
                <li><a className="dropdown-item" href="/myvideos">Your Videos</a></li>
                <hr className="dropdown-hr" />
                <li><a className="dropdown-item" href="/saved">Saved Videos</a></li>
                <hr className="dropdown-hr" />
                <li><a className="dropdown-item" href="/upload" onClick={navigateToUpload} >Upload</a></li>
                <hr className="dropdown-hr" />
                <li><a className="dropdown-item bg-danger" href="#" onClick={logout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
}

export default Header;