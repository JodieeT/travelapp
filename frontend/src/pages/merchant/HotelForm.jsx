import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export function HotelForm() {
  return (
    <Layout>
      <h1 className="pc-page-title">新建酒店</h1>
      <div className="pc-card">
        <form>
          <h2>基本信息</h2>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>酒店中文名 *</label>
              <input placeholder="如：易宿精选酒店" />
            </div>
            <div className="pc-form-group">
              <label>酒店英文名</label>
              <input placeholder="Hotel Name" />
            </div>
          </div>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>城市</label>
              <input placeholder="如：北京" />
            </div>
            <div className="pc-form-group">
              <label>地址 *</label>
              <input placeholder="详细地址" />
            </div>
          </div>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>星级</label>
              <select>
                <option value="">请选择</option>
                <option value={3}>3 星</option>
                <option value={4}>4 星</option>
                <option value={5}>5 星</option>
              </select>
            </div>
            <div className="pc-form-group">
              <label>开业日期</label>
              <input type="date" />
            </div>
          </div>
          <div className="pc-form-group">
            <label><input type="checkbox" /> 设为首页 Banner</label>
          </div>
          <div className="pc-form-group">
            <label>Banner 排序（数字越小越靠前）</label>
            <input type="number" defaultValue={0} />
          </div>

          <h2 style={{ marginTop: 24 }}>图片 URL</h2>
          <div className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
            <input placeholder="https://..." style={{ flex: 1 }} />
            <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">删除</button>
          </div>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">+ 添加图片</button>

          <h2 style={{ marginTop: 24 }}>标签</h2>
          <div className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
            <input placeholder="标签" style={{ flex: 1, maxWidth: 200 }} />
            <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">删除</button>
          </div>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">+ 添加标签</button>

          <h2 style={{ marginTop: 24 }}>设施</h2>
          <div className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
            <input placeholder="设施" style={{ flex: 1, maxWidth: 200 }} />
            <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">删除</button>
          </div>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">+ 添加设施</button>

          <h2 style={{ marginTop: 24 }}>房型与价格</h2>
          <div className="pc-form-row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
            <div className="pc-form-group">
              <label>房型名称</label>
              <input placeholder="如：大床房" />
            </div>
            <div className="pc-form-group">
              <label>基础价格（元）</label>
              <input type="number" min={0} placeholder="299" />
            </div>
            <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">删除房型</button>
          </div>
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm">+ 添加房型</button>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button type="submit" className="pc-btn pc-btn-primary">保存</button>
            <Link to="/merchant" className="pc-btn pc-btn-ghost">取消</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
