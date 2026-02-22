import {Link, useNavigate} from 'react-router-dom';
import './Auth.css';
import {useState} from "react";
import {auth} from "../api/request.js";

export function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("merchant")
  const [adminCode, setAdminCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim()) {
      setError("请输入用户名")
      return
    }
    if (!password) {
      setError("请输入密码")
      return
    }
    if (password.length < 6) {
      setError("密码至少需要 6 位")
      return
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }
    setLoading(true)
    try {
      await auth.register({username, password, role})
      navigate("/login")
    } catch (e) {
      setError(e.message || "注册失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>易宿 · 管理平台</h1>
        <p className="auth-subtitle">注册</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="pc-error">{error}</p>}
          <div className="pc-form-group">
            <label>用户名</label>
            <input
                type="text"
                placeholder="请输入用户名"
                autoComplete="username"
                value={username}
                onChange={(e) =>setUsername(e.target.value)}
                required={true}
            />
          </div>
          <div className="pc-form-group">
            <label>密码（至少 6 位）</label>
            <input
                type="password"
                placeholder="请输入密码"
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
            />
          </div>
          <div className="pc-form-group">
            <label>确认密码</label>
            <input
                type="password"
                placeholder="请再次输入密码"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={true}
            />
          </div>
          <div className="pc-form-group">
            <label>角色</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="merchant">商户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          {role === "admin" && (
            <div className="pc-form-group">
              <label>管理员认证码</label>
              <input
                  type="text"
                  placeholder="请输入管理员认证码"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>
          )}
          <button
              type="submit"
              className="pc-btn pc-btn-primary"
              style={{ width: '100%', maxWidth: 400 }}
              disabled={loading}
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>
        <p className="auth-footer">
          已有账号？ <Link to="/login">登录</Link>
        </p>
      </div>
    </div>
  );
}
