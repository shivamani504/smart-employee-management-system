import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert(data.message);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-card">

      <h1>Welcome Back 👋</h1>

      <p>Login to access your Smart EMS dashboard</p>

      {/* Email */}

      <div className="input-group">

        <label>Email Address</label>

        <div className="input-box">

          <FaEnvelope className="input-icon"/>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Password */}

      <div className="input-group">

        <label>Password</label>

        <div className="input-box">

          <FaLock className="input-icon"/>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>

        </div>

      </div>

      <button
        className="login-btn"
        onClick={handleLogin}
      >
        Login
        <FaArrowRight
          style={{
            marginLeft: "10px",
          }}
        />
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "25px",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Register
        </Link>
      </p>

    </div>
  );
}

export default LoginForm;