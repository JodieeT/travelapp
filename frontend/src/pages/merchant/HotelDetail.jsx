import {Link, useParams} from 'react-router-dom';
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

export function HotelDetail() {
  const {id} = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    merchant.getHotel(id)
        .then((data) => {setHotel(data)})
        .catch((e) => {setError(e.message)})
        .finally(() => {setLoading(false)})
  }, [id])

  function handleSubmit() {
    setIsSubmitting(true)
    merchant.submitHotel(id)
        .then((data) => {setHotel(data)})
        .catch((e) => {setError(e.message)})
        .finally(() => {setIsSubmitting(false)})
  }

  if (loading) {
    return (
        <Layout>
          <h1 className="pc-page-title">酒店详情</h1>
          <div className="pc-card">
            <p className="pc-empty">加载中...</p>
          </div>
        </Layout>
    )
  }
  if (error || !hotel) {
    return (
        <Layout>
          <h1 className="pc-page-title">酒店详情</h1>
          <div className="pc-card">
            <p className="pc-error">{error || '酒店不存在'}</p>
            <Link to="/merchant" className="pc-btn pc-btn-ghost">返回列表</Link>
          </div>
        </Layout>
    )
  }

  const canEdit = hotel.status === 'draft' || hotel.status === 'rejected'

  return (
      <Layout>
        <h1 className="pc-page-title">酒店详情</h1>
        <div className="pc-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <span className="pc-status pc-status-draft">草稿</span>
            <div className="pc-actions">
              <Link to="/merchant" className="pc-btn pc-btn-ghost pc-btn-sm">返回列表</Link>
              {canEdit && <Link to="/merchant/hotels/1/edit" className="pc-btn pc-btn-primary pc-btn-sm">编辑</Link>}
              {canEdit && <button
                  type="button"
                  className="pc-btn pc-btn-success pc-btn-sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交审核'}
              </button>}
            </div>
          </div>
          <p><strong>中文名：</strong>{hotel.name_cn}</p>
          <p><strong>英文名：</strong>{hotel.name_en}</p>
          <p><strong>城市：</strong>{hotel.city}</p>
          <p><strong>地址：</strong>{hotel.address}</p>
          <p><strong>星级：</strong>{hotel.star_level}</p>
          <p><strong>开业日期：</strong>{hotel.createdAt.slice(0, 10)}</p>
          <h3 style={{marginTop: 24}}>房型与价格</h3>
          <div className="pc-table-wrap">
            <table className="pc-table">
              <thead>
              <tr>
                <th>房型</th>
                <th>基础价格（元）</th>
              </tr>
              </thead>
              <tbody>
                {hotel.Rooms.map((r) => {return (
                    <tr key={r.id}>
                      <td>{r.type_name}</td>
                      <td>{r.base_price}</td>
                    </tr>
                )})}
              </tbody>
            </table>
          </div>
          <p><strong>标签：</strong>-</p>
          <p><strong>设施：</strong>-</p>
        </div>
      </Layout>
  )
}
