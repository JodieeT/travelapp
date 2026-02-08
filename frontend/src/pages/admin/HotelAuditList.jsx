import { Layout } from '../../components/Layout';

export function HotelAuditList() {
  return (
    <Layout>
      <h1 className="pc-page-title">酒店审核与发布管理</h1>
      <div className="pc-card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <label>
            状态筛选：
            <select style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <option value="">全部</option>
              <option value="pending">审核中</option>
              <option value="approved">已发布</option>
              <option value="rejected">已驳回</option>
              <option value="offline">已下线</option>
              <option value="draft">草稿</option>
            </select>
          </label>
        </div>
        <div className="pc-table-wrap">
          <table className="pc-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>酒店名称</th>
                <th>城市</th>
                <th>星级</th>
                <th>房型/价格</th>
                <th>状态</th>
                <th>驳回原因</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="pc-empty">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">上一页</button>
          <span>第 1 页</span>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">下一页</button>
        </div>
      </div>
    </Layout>
  );
}
