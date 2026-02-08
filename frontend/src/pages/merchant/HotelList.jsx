import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export function HotelList() {
  return (
    <Layout>
      <h1 className="pc-page-title">我的酒店</h1>
      <div className="pc-card">
        <p className="pc-empty">暂无酒店，<Link to="/merchant/hotels/new">新建酒店</Link></p>
        <p style={{ marginTop: 16 }}>
          <Link to="/merchant/hotels/new" className="pc-btn pc-btn-primary">新建酒店</Link>
        </p>
      </div>
      <div className="pc-card">
        <div className="pc-table-wrap">
          <table className="pc-table">
            <thead>
              <tr>
                <th>酒店名称</th>
                <th>城市</th>
                <th>星级</th>
                <th>房型/价格</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="pc-empty">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
