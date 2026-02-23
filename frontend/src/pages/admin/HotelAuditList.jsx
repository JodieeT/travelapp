import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { admin } from '../../api/request';

const STATUS_MAP = {
  draft: { label: '草稿', className: 'pc-status-draft' },
  pending: { label: '审核中', className: 'pc-status-pending' },
  approved: { label: '已发布', className: 'pc-status-approved' },
  rejected: { label: '已驳回', className: 'pc-status-rejected' },
  offline: { label: '已下线', className: 'pc-status-offline' },
};

const PAGE_SIZE = 10;

function getMinPrice(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) return null;
  const prices = rooms.map((r) => r.base_price).filter((p) => p != null);
  return prices.length ? Math.min(...prices) : null;
}

function getRoomSummary(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) return '-';
  const names = rooms.slice(0, 3).map((r) => r.type_name || '房型').join('、');
  return rooms.length > 3 ? `${names} 等${rooms.length}种` : names;
}

export function HotelAuditList() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const loadList = () => {
    setLoading(true);
    setError('');
    const params = { page, limit: PAGE_SIZE };
    if (status) params.status = status;
    admin
      .getHotels(params)
      .then((data) => {
        setList(data.list || []);
        setTotal(data.total ?? 0);
      })
      .catch((e) => setError(e.message || '加载失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, [page, status]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handleApprove = (id) => {
    setActingId(id);
    admin
      .approveHotel(id)
      .then(() => loadList())
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActingId(null));
  };

  const handleReject = (id) => {
    const reason = window.prompt('请输入驳回原因：');
    if (reason === null) return;
    setActingId(id);
    admin
      .rejectHotel(id, reason)
      .then(() => loadList())
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActingId(null));
  };

  const handleOffline = (id) => {
    if (!window.confirm('确定下线该酒店？下线后可恢复。')) return;
    setActingId(id);
    admin
      .offlineHotel(id)
      .then(() => loadList())
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActingId(null));
  };

  const handleRestore = (id) => {
    setActingId(id);
    admin
      .restoreHotel(id)
      .then(() => loadList())
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActingId(null));
  };

  const handleSetBanner = (id, isBanner, bannerSort = 0) => {
    setActingId(id);
    admin
      .setBanner(id, { is_banner: isBanner, banner_sort: bannerSort })
      .then(() => loadList())
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActingId(null));
  };

  return (
    <Layout>
      <h1 className="pc-page-title">酒店审核与发布管理</h1>
      <div className="pc-card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <label>
            状态筛选：
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}
            >
              <option value="">全部</option>
              <option value="pending">审核中</option>
              <option value="approved">已发布</option>
              <option value="rejected">已驳回</option>
              <option value="offline">已下线</option>
              <option value="draft">草稿</option>
            </select>
          </label>
        </div>
        {error && <p className="pc-error">{error}</p>}
        {loading ? (
          <p className="pc-empty">加载中...</p>
        ) : (
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
                  <th>Banner</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="pc-empty">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  list.map((h) => {
                    const rooms = h.Rooms || [];
                    const minPrice = getMinPrice(rooms);
                    const statusInfo = STATUS_MAP[h.status] || { label: h.status, className: '' };
                    const busy = actingId === h.id;
                    return (
                      <tr key={h.id}>
                        <td>{h.id}</td>
                        <td>{h.name_cn || '-'}</td>
                        <td>{h.city || '-'}</td>
                        <td>{h.star_level != null ? `${h.star_level} 星` : '-'}</td>
                        <td>
                          {getRoomSummary(rooms)}
                          {minPrice != null && ` / ￥${minPrice}`}
                        </td>
                        <td>
                          <span className={`pc-status ${statusInfo.className}`}>{statusInfo.label}</span>
                        </td>
                        <td>{h.status === 'approved' ? (h.is_banner ? `是（排序 ${h.banner_sort ?? 0}）` : '否') : '-'}</td>
                        <td>
                          <div className="pc-actions">
                            <Link to={`/admin/hotels/${h.id}`} className="pc-btn pc-btn-ghost pc-btn-sm">
                              查看
                            </Link>
                            {h.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  className="pc-btn pc-btn-success pc-btn-sm"
                                  onClick={() => handleApprove(h.id)}
                                  disabled={busy}
                                >
                                  {busy ? '...' : '通过'}
                                </button>
                                <button
                                  type="button"
                                  className="pc-btn pc-btn-danger pc-btn-sm"
                                  onClick={() => handleReject(h.id)}
                                  disabled={busy}
                                >
                                  {busy ? '...' : '驳回'}
                                </button>
                              </>
                            )}
                            {h.status === 'approved' && (
                              <>
                                {h.is_banner ? (
                                  <button
                                    type="button"
                                    className="pc-btn pc-btn-ghost pc-btn-sm"
                                    onClick={() => handleSetBanner(h.id, false)}
                                    disabled={busy}
                                  >
                                    {busy ? '...' : '取消Banner'}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="pc-btn pc-btn-ghost pc-btn-sm"
                                    onClick={() => handleSetBanner(h.id, true, 0)}
                                    disabled={busy}
                                  >
                                    {busy ? '...' : '设为Banner'}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="pc-btn pc-btn-ghost pc-btn-sm"
                                  onClick={() => handleOffline(h.id)}
                                  disabled={busy}
                                >
                                  {busy ? '...' : '下线'}
                                </button>
                              </>
                            )}
                            {h.status === 'offline' && (
                              <button
                                type="button"
                                className="pc-btn pc-btn-primary pc-btn-sm"
                                onClick={() => handleRestore(h.id)}
                                disabled={busy}
                              >
                                {busy ? '...' : '恢复'}
                              </button>
                            )}
                            {(h.status === 'draft' || h.status === 'rejected') && (
                              <span style={{ color: '#718096', fontSize: 0.875 }}>待商户提交</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className="pc-btn pc-btn-ghost pc-btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            上一页
          </button>
          <span>
            第 {page} / {totalPages} 页，共 {total} 条
          </span>
          <button
            type="button"
            className="pc-btn pc-btn-ghost pc-btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            下一页
          </button>
        </div>
      </div>
    </Layout>
  );
}
