import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getProfile } from "../services/profileService";

function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <FaUserCircle
          size={100}
          color="#2563EB"
          style={{ marginBottom: "20px" }}
        />

        <h2>{profile.name}</h2>

        <hr />

        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <h3>📧 Email</h3>
          <p>{profile.email}</p>

          <h3>🏢 Department</h3>
          <p>{profile.department}</p>

          <h3>💼 Position</h3>
          <p>{profile.position}</p>

          <h3>💰 Salary</h3>
          <p>₹{profile.salary}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;