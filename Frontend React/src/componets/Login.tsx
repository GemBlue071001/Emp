import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gọi API đăng nhập
      const response = await fetch("https://localhost:7073/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data.result; 

      // Lưu token vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Gọi introspect để xác minh token
      const introspectResponse = await fetch("https://localhost:7073/api/auth/introspect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
      });

      console.log(introspectResponse);

      if (!introspectResponse.ok) {
        throw new Error("Token introspection failed.");
      }

      const introspectData = await introspectResponse.json();
      console.log(introspectData);
      const { valid, scope } = introspectData.result;
      console.log(valid, scope);

      if (valid) {
        // Nếu token hợp lệ, kiểm tra scope
        if (scope === "ADMIN") {
          navigate("/admin");  
        } else if (scope === "MANAGER") {
          navigate("/home");  
        }
        else if (scope === "USER") {
            navigate("/home");  
          } else {
          setError("Invalid scope in token.");
        }
      } else {
        setError("Invalid token.");
      }
    } catch (error: any) {
      // Xử lý lỗi chi tiết hơn
      console.error("Login failed:", error);
      setError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
