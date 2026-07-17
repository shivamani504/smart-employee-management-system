import LoginForm from "../components/LoginForm";
import LoginHero from "../components/LoginHero";

import "../styles/login.css";

function Login() {
  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <LoginHero />

      {/* RIGHT SIDE */}
      <div className="login-form-container">
        <LoginForm />
      </div>

    </div>
  );
}

export default Login;