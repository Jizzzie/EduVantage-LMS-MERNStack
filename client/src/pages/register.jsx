import "./login.scss";
import axios from 'axios';
import Logo from "../assets/codecampus-logo/png/logo-white.png";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regNo, setRegNo] = useState('');
  const [passkey, setPasskey] = useState('');
  const [rerror, setRError] = useState(false);
  const [merror, setMError] = useState(false);

  const handlePasskeyChange = (e) => {
    setPasskey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRError(false);
    setMError(false);

    // Validate passkey
    if (passkey !== '0000') {
      setMError(true);
      return;
    }

    // Validate regNo format
    const regNoRegex = /^(23480)\d{2}$/;
    if (!regNoRegex.test(regNo)) {
      setMError(true);
      return;
    }

    // Generate password using name and regNo
    const firstName = name.split(' ')[0].toLowerCase();
    const pass = `${firstName}${regNo}`;

    // Your existing code for making the API call
    const response = await axios.post('http://localhost:3000/account/register', {
      name,
      email,
      pass,
    });

    if (response.status === 201) {
      navigate('/login');
    } else if (response.status === 203) {
      setRError(true);
    }
  };

  return (
    <div className="flex-cenetered vh100">
      <form className="card px-6 py-5 border-0 shadow" onSubmit={handleSubmit}>
        <img className="mb-4" src={Logo} alt="" width="72" height="57" />

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="abc xyz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Name</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="email"
            className="form-control"
            id="floating"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            id="regNo"
            placeholder="Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
          />
          <label htmlFor="regNo">Registration Number</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            id="passkey"
            placeholder="Passkey"
            value={passkey}
            onChange={handlePasskeyChange}
            required
          />
          <label htmlFor="passkey">Passkey</label>
        </div>

        {rerror && <p className="acc-error">This email ID is already registered.</p>}
        {merror && <p className="acc-error">Invalid Passkey or Registration Number.</p>}

        <button className="w-100 btn btn-lg mb-4" type="submit">
          Register
        </button>

        <a href="#" className="link-primary text-center text-decoration-none" onClick={() => navigate('/login')}>
          Sign In
        </a>
      </form>

      <img src="https://tuples.ai/wp-content/uploads/2022/12/shutterstock_666790651.jpg" alt="no bg" className="bg-icon" />
    </div>
  );
};

export default Register;
