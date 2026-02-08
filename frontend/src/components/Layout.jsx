import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const isMerchant = user?.role === 'merchant';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="pc-layout">
      <header className="pc-header">
        <div className="pc-header-inner">
          <Link to={isMerchant ? '/merchant' : '/admin'} className="pc-logo">
            易宿 · 管理平台
          </Link>
          <nav className="pc-nav">
            {isMerchant && (
              <>
                <Link to="/merchant" className={location.pathname === '/merchant' ? 'active' : ''}>我的酒店</Link>
                <Link to="/merchant/hotels/new" className={location.pathname === '/merchant/hotels/new' ? 'active' : ''}>新建酒店</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>酒店审核</Link>
            )}
          </nav>
          <div className="pc-user">
            <span className="pc-role">{user?.role === 'merchant' ? '商户' : '管理员'}</span>
            <span className="pc-username">{user?.username}</span>
            <button type="button" className="pc-btn pc-btn-ghost">退出</button>
          </div>
        </div>
      </header>
      <main className="pc-main">{children}</main>
    </div>
  );
}
