import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useEffect, useState } from 'react';
import { admin } from '../../api/request.js';

function parseJsonField(val) {
  if (val == null) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (_) {
      return [];
    }
  }
  return [];
}

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return base + path;
}

const STATUS_MAP = {
  draft: { label: '草稿', className: 'pc-status-draft' },
  pending: { label: '审核中', className: 'pc-status-pending' },
  approved: { label: '已发布', className: 'pc-status-approved' },
  rejected: { label: '已驳回', className: 'pc-status-rejected' },
  offline: { label: '已下线', className: 'pc-status-offline' },
};

export function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('无效的酒店 ID');
      return;
    }
    setLoading(true);
    setError('');
    setHotel(null);
    let cancelled = false;
    admin
      .getHotel(id)
      .then((data) => {
        if (!cancelled && data) setHotel(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || '加载失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleApprove = () => {
    if (!window.confirm('确定通过该酒店的审核？')) return;
    setActing(true);
    admin
      .approveHotel(id)
      .then((data) => setHotel(data))
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActing(false));
  };

  const handleReject = () => {
    const reason = window.prompt('请输入驳回原因：');
    if (reason === null) return;
    setActing(true);
    admin
      .rejectHotel(id, reason)
      .then((data) => setHotel(data))
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActing(false));
  };

  const handleOffline = () => {
    if (!window.confirm('确定下线该酒店？下线后可恢复。')) return;
    setActing(true);
    admin
      .offlineHotel(id)
      .then((data) => setHotel(data))
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActing(false));
  };

  const handleRestore = () => {
    setActing(true);
    admin
      .restoreHotel(id)
      .then((data) => setHotel(data))
      .catch((e) => alert(e.message || '操作失败'))
      .finally(() => setActing(false));
  };

  if (loading) {
    return (
      <Layout>
        <h1 className="pc-page-title">酒店详情</h1>
        <div className="pc-card">
          <p className="pc-empty">加载中...</p>
        </div>
      </Layout>
    );
  }
  if (error || !hotel) {
    return (
      <Layout>
        <h1 className="pc-page-title">酒店详情</h1>
        <div className="pc-card">
          <p className="pc-error">{error || '酒店不存在'}</p>
          <p style={{ marginTop: 8, color: '#718096', fontSize: 14 }}>请检查链接或返回列表</p>
          <Link to="/admin" className="pc-btn pc-btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            返回列表
          </Link>
        </div>
      </Layout>
    );
  }

  const statusInfo = STATUS_MAP[hotel.status] || { label: hotel.status, className: '' };
  const roomsRaw = hotel.Rooms ?? hotel.rooms ?? [];
  const rooms = (Array.isArray(roomsRaw) ? roomsRaw : [])
    .slice()
    .sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
  const tagsStr = parseJsonField(hotel.tags).join('、') || '-';
  const facilitiesStr = parseJsonField(hotel.facilities).join('、') || '-';

  return (
    <Layout>
      <h1 className="pc-page-title">酒店详情</h1>
      <div className="pc-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span className={`pc-status ${statusInfo.className}`}>{statusInfo.label}</span>
          <div className="pc-actions">
            <Link to="/admin" className="pc-btn pc-btn-ghost pc-btn-sm">
              返回列表
            </Link>
            {hotel.status === 'pending' && (
              <>
                <button
                  type="button"
                  className="pc-btn pc-btn-success pc-btn-sm"
                  onClick={handleApprove}
                  disabled={acting}
                >
                  {acting ? '...' : '通过'}
                </button>
                <button
                  type="button"
                  className="pc-btn pc-btn-danger pc-btn-sm"
                  onClick={handleReject}
                  disabled={acting}
                >
                  {acting ? '...' : '驳回'}
                </button>
              </>
            )}
            {hotel.status === 'approved' && (
              <button
                type="button"
                className="pc-btn pc-btn-ghost pc-btn-sm"
                onClick={handleOffline}
                disabled={acting}
              >
                {acting ? '...' : '下线'}
              </button>
            )}
            {hotel.status === 'offline' && (
              <button
                type="button"
                className="pc-btn pc-btn-primary pc-btn-sm"
                onClick={handleRestore}
                disabled={acting}
              >
                {acting ? '...' : '恢复'}
              </button>
            )}
          </div>
        </div>
        {hotel.status === 'rejected' && hotel.reject_reason && (
          <p className="pc-error" style={{ marginBottom: 16 }}>
            驳回原因：{hotel.reject_reason}
          </p>
        )}
        <p><strong>中文名：</strong>{hotel.name_cn ?? '-'}</p>
        <p><strong>英文名：</strong>{hotel.name_en ?? '-'}</p>
        {parseJsonField(hotel.images).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p><strong>图片：</strong></p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              {parseJsonField(hotel.images).map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`酒店图片${idx + 1}`}
                  style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 8 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>
          </div>
        )}
        <p><strong>城市：</strong>{hotel.city ?? '-'}</p>
        <p><strong>地址：</strong>{hotel.address ?? '-'}</p>
        <p><strong>星级：</strong>{hotel.star_level != null ? `${hotel.star_level} 星` : '-'}</p>
        <p><strong>开业日期：</strong>{hotel.open_date ? hotel.open_date.slice(0, 10) : (hotel.createdAt ? hotel.createdAt.slice(0, 10) : '-')}</p>
        <h3 style={{ marginTop: 24 }}>房型与价格</h3>
        <div className="pc-table-wrap">
          <table className="pc-table">
            <thead>
              <tr>
                <th>房型</th>
                <th>基础价格（元）</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={2} className="pc-empty">暂无房型</td>
                </tr>
              ) : (
                rooms.map((r) => (
                  <tr key={r.id ?? r.type_name}>
                    <td>{r.type_name ?? '-'}</td>
                    <td>￥{r.base_price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p><strong>标签：</strong>{tagsStr}</p>
        <p><strong>设施：</strong>{facilitiesStr}</p>
      </div>
    </Layout>
  );
}
