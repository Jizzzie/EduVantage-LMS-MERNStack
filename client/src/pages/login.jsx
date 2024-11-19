import "./login.scss";
import axios from 'axios';
import Logo from "../assets/codecampus-logo/png/logo-white.png"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [perror, setPError] = useState(false);
  const [uerror, setUError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/account/login', { email, pass });
    if (response.status == 200) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('email', response.data.email);
      setUError(false);
      setPError(false);
      navigate('/home');
    }
    else if (response.status == 202) {
      setPError(true);
      setUError(false);
    }
    else if (response.status == 203) {
      setUError(true);
      setPError(false);
    }
  }

  return <div className="flex-cenetered vh100">
    <form className="card px-6 py-5 border-0 shadow" onSubmit={handleSubmit}>
      <img className="mb-4" src={Logo} alt="" width="72" height="57" />

      <div className="form-floating mb-4">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating mb-5">
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      {uerror && <p className="acc-error">Email is not registered.</p>}
      {perror && <p className="acc-error">Inavlid Password.</p>}

      <button className="w-100 btn btn-lg mb-4" type="submit">Sign in</button>
      <a href="#" className="link-primary text-center text-decoration-none" onClick={() => navigate('/register')}>Register</a>
    </form>

    <img src="https://tuples.ai/wp-content/uploads/2022/12/shutterstock_666790651.jpg" alt="no bg" className="bg-icon" />
  </div>
}

export default Login;