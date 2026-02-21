import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import {useEffect, useState} from "react";
import {merchant} from "../../api/request.js";

const STATUS_MAP = {
  draft: { label: '草稿', className: 'pc-status-draft' },
  pending: { label: '审核中', className: 'pc-status-pending' },
  approved: { label: '已发布', className: 'pc-status-approved' },
  rejected: { label: '已驳回', className: 'pc-status-rejected' },
  offline: { label: '已下线', className: 'pc-status-offline' },
}

export function HotelList() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancel = false
    merchant.getHotels().then((data) => {
      if (!cancel) {
        setHotels(data)
      }
    }).catch((e) => {
      if (!cancel) {
        setError(e.message || "加载失败")
      }
    }).finally(() => {
      if (!cancel) {
        setLoading(false)
      }
    })
    return () => {cancel = true}
  }, [])

  return (
    <Layout>
      <h1 className="pc-page-title">我的酒店</h1>
      <div className="pc-card">
        {loading && <p className="pc-empty">加载中...</p>}
        {hotels.length === 0 && <p className="pc-empty">暂无酒店，<Link to="/merchant/hotels/new">新建酒店</Link></p>}
        <p style={{ marginTop: 16 }}>
          <Link to="/merchant/hotels/new" className="pc-btn pc-btn-primary">新建酒店</Link>
        </p>
      </div>
      {error && <p className="pc-error">{error}</p>}
      {hotels.length !== 0 && <div className="pc-card">
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
              {
                hotels.map((hotel) => {
                  const canEdit = hotel.status === 'draft' || hotel.status === 'rejected'
                  return (
                      <tr key={hotel.id}>
                        <td>{hotel.name_cn}</td>
                        <td>{hotel.city}</td>
                        <td>{hotel.star_level}</td>
                        <td>
                          {(hotel.Rooms || []).map((r, i) => (
                            <span key={r.id ?? `room-${i}`} style={{ display: 'block' }}>{r.type_name} ￥{r.base_price}</span>
                          ))}
                        </td>
                        <td>
                          <span className={`pc-status ${STATUS_MAP[hotel.status].className}`}>{STATUS_MAP[hotel.status].label}</span>
                        </td>
                        <td>
                          <Link to={`/merchant/hotels/${hotel.id}`} className="pc-btn pc-btn-ghost pc-btn-sm">
                            查看
                          </Link>
                          {canEdit && (
                              <Link to={`/merchant/hotels/${hotel.id}/edit`} className="pc-btn pc-btn-primary pc-btn-sm">
                                编辑
                              </Link>
                          )}
                        </td>
                      </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>}
    </Layout>
  );
}
