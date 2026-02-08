import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export function HotelDetail() {
  return (
    <Layout>
      <h1 className="pc-page-title">酒店详情</h1>
      <div className="pc-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span className="pc-status pc-status-draft">草稿</span>
          <div className="pc-actions">
            <Link to="/merchant" className="pc-btn pc-btn-ghost pc-btn-sm">返回列表</Link>
            <Link to="/merchant/hotels/1/edit" className="pc-btn pc-btn-primary pc-btn-sm">编辑</Link>
          </div>
        </div>
        <p><strong>中文名：</strong>-</p>
        <p><strong>英文名：</strong>-</p>
        <p><strong>城市：</strong>-</p>
        <p><strong>地址：</strong>-</p>
        <p><strong>星级：</strong>-</p>
        <p><strong>开业日期：</strong>-</p>
        <h3 style={{ marginTop: 24 }}>房型与价格</h3>
        <div className="pc-table-wrap">
          <table className="pc-table">
            <thead><tr><th>房型</th><th>基础价格（元）</th></tr></thead>
            <tbody>
              <tr><td colSpan={2} className="pc-empty">暂无房型</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>标签：</strong>-</p>
        <p><strong>设施：</strong>-</p>
      </div>
    </Layout>
  );
}
