import {Link, useNavigate} from 'react-router-dom';
import './Auth.css';
import {useState} from "react";
import {auth} from "../api/request.js";

export function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const {token, user} = await auth.login({username, password})
      localStorage.setItem("token", token)
      const role = user.role
      if (role === "merchant") {
        navigate("/merchant")
      }
      else if (role === "admin") {
        navigate("/admin")
      }
    }
    catch (e) {
      setError(e.message || "登录失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>易宿 · 管理平台</h1>
        <p className="auth-subtitle">登录</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="pc-error">{error}</p>}
          <div className="pc-form-group">
            <label>用户名</label>
            <input
                type="text"
                placeholder="请输入用户名"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={true}
            />
          </div>
          <div className="pc-form-group">
            <label>密码</label>
            <input
                type="password"
                placeholder="请输入密码"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
            />
          </div>
          <button
              type="submit"
              className="pc-btn pc-btn-primary"
              style={{ width: '100%', maxWidth: 400 }}
              disabled={loading}
          >
            {loading ? "登录中" : "登录"}
          </button>
        </form>
        <p className="auth-footer">
          还没有账号？ <Link to="/register">注册</Link>
        </p>
      </div>
    </div>
  );
}
