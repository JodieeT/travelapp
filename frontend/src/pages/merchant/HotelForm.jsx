import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { merchant, uploadImages } from '../../api/request';

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

const STAR_OPTIONS = [3, 4, 5];

export function HotelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name_cn, setName_cn] = useState('');
  const [name_en, setName_en] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [star_level, setStar_level] = useState('');
  const [open_date, setOpen_date] = useState('');
  const [images, setImages] = useState(['']);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(['']);
  const [facilities, setFacilities] = useState(['']);
  const [rooms, setRooms] = useState([{ type_name: '', base_price: '' }]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    merchant
      .getHotel(id)
      .then((data) => {
        setName_cn(data.name_cn || '');
        setName_en(data.name_en || '');
        setCity(data.city || '');
        setAddress(data.address || '');
        setStar_level(data.star_level != null ? String(data.star_level) : '');
        setOpen_date(data.open_date ? data.open_date.slice(0, 10) : '');
        const imgs = parseJsonField(data.images);
        setImages(imgs.length ? imgs : ['']);
        const t = parseJsonField(data.tags);
        setTags(t.length ? t : ['']);
        const f = parseJsonField(data.facilities);
        setFacilities(f.length ? f : ['']);
        const r = (data.Rooms || []).map((x) => ({
          type_name: x.type_name || '',
          base_price: x.base_price != null ? x.base_price : '',
        }));
        setRooms(r.length ? r : [{ type_name: '', base_price: '' }]);
      })
      .catch((e) => setError(e.message || '加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  const addRow = (setter, emptyItem) => {
    setter((prev) => [...prev, emptyItem]);
  };
  const removeRow = (setter, index) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };
  const updateRooms = (index, field, value) => {
    setRooms((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError('');
    uploadImages(Array.from(files))
      .then((data) => {
        const urls = data.urls || [];
        setImages((prev) => [...prev.filter((u) => String(u).trim()), ...urls, '']);
      })
      .catch((err) => setError(err.message || '上传失败'))
      .finally(() => { setUploading(false); e.target.value = ''; });
  };

  const buildPayload = () => {
    const imagesFiltered = images.filter((u) => String(u).trim());
    const tagsFiltered = tags.filter((t) => String(t).trim());
    const facilitiesFiltered = facilities.filter((f) => String(f).trim());
    const roomsFiltered = rooms
      .filter((r) => r.type_name != null && r.base_price !== '' && r.base_price != null)
      .map((r) => ({ type_name: r.type_name, base_price: Number(r.base_price) }));

    return {
      name_cn: name_cn.trim(),
      name_en: name_en.trim() || undefined,
      city: city.trim() || undefined,
      address: address.trim(),
      star_level: star_level === '' ? undefined : Number(star_level),
      open_date: open_date || undefined,
      images: imagesFiltered,
      tags: tagsFiltered,
      facilities: facilitiesFiltered,
      rooms: roomsFiltered,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const payload = buildPayload();
    if (!payload.name_cn || !payload.address) {
      setError('请填写酒店中文名和地址');
      return;
    }
    setSaving(true);
    const promise = isEdit ? merchant.updateHotel(id, payload) : merchant.createHotel(payload);
    promise
      .then((data) => {
        navigate(isEdit ? `/merchant/hotels/${data.id}` : '/merchant', { replace: true });
      })
      .catch((e) => setError(e.message || '保存失败'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <Layout>
        <h1 className="pc-page-title">{isEdit ? '编辑酒店' : '新建酒店'}</h1>
        <div className="pc-card">
          <p className="pc-empty">加载中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="pc-page-title">{isEdit ? '编辑酒店' : '新建酒店'}</h1>
      <div className="pc-card">
        <form onSubmit={handleSubmit}>
          {error && <p className="pc-error">{error}</p>}
          <h2>基本信息</h2>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>酒店中文名 *</label>
              <input
                placeholder="如：易宿精选酒店"
                value={name_cn}
                onChange={(e) => setName_cn(e.target.value)}
              />
            </div>
            <div className="pc-form-group">
              <label>酒店英文名</label>
              <input
                placeholder="Hotel Name"
                value={name_en}
                onChange={(e) => setName_en(e.target.value)}
              />
            </div>
          </div>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>城市</label>
              <input placeholder="如：北京" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="pc-form-group">
              <label>地址 *</label>
              <input placeholder="详细地址" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="pc-form-row">
            <div className="pc-form-group">
              <label>星级</label>
              <select value={star_level} onChange={(e) => setStar_level(e.target.value)}>
                <option value="">请选择</option>
                {STAR_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} 星
                  </option>
                ))}
              </select>
            </div>
            <div className="pc-form-group">
              <label>开业日期</label>
              <input type="date" value={open_date} onChange={(e) => setOpen_date(e.target.value)} />
            </div>
          </div>

          <h2 style={{ marginTop: 24 }}>图片</h2>
          <div className="pc-form-group" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button
              type="button"
              className="pc-btn pc-btn-primary pc-btn-sm"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? '上传中...' : '从本地上传图片'}
            </button>
            <span style={{ color: '#718096', fontSize: 13 }}>支持 JPEG/PNG/GIF/WebP，单张不超过 5MB</span>
          </div>
          <p style={{ marginTop: 4, marginBottom: 12, fontSize: 13, color: '#718096' }}>或填写图片 URL：</p>
          {images.map((url, index) => (
            <div key={index} className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="https://... 或 /uploads/xxx"
                style={{ flex: 1 }}
                value={url}
                onChange={(e) =>
                  setImages((prev) => prev.map((u, i) => (i === index ? e.target.value : u)))
                }
              />
              <button
                type="button"
                className="pc-btn pc-btn-ghost pc-btn-sm"
                onClick={() => removeRow(setImages, index)}
              >
                删除
              </button>
            </div>
          ))}
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm" onClick={() => addRow(setImages, '')}>
            + 添加图片 URL
          </button>

          <h2 style={{ marginTop: 24 }}>标签</h2>
          {tags.map((tag, index) => (
            <div key={index} className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="标签"
                style={{ flex: 1, maxWidth: 200 }}
                value={tag}
                onChange={(e) =>
                  setTags((prev) => prev.map((t, i) => (i === index ? e.target.value : t)))
                }
              />
              <button
                type="button"
                className="pc-btn pc-btn-ghost pc-btn-sm"
                onClick={() => removeRow(setTags, index)}
              >
                删除
              </button>
            </div>
          ))}
          <button type="button" className="pc-btn pc-btn-ghost pc-btn-sm" onClick={() => addRow(setTags, '')}>
            + 添加标签
          </button>

          <h2 style={{ marginTop: 24 }}>设施</h2>
          {facilities.map((fac, index) => (
            <div key={index} className="pc-form-group" style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="设施"
                style={{ flex: 1, maxWidth: 200 }}
                value={fac}
                onChange={(e) =>
                  setFacilities((prev) => prev.map((f, i) => (i === index ? e.target.value : f)))
                }
              />
              <button
                type="button"
                className="pc-btn pc-btn-ghost pc-btn-sm"
                onClick={() => removeRow(setFacilities, index)}
              >
                删除
              </button>
            </div>
          ))}
          <button
            type="button"
            className="pc-btn pc-btn-ghost pc-btn-sm"
            onClick={() => addRow(setFacilities, '')}
          >
            + 添加设施
          </button>

          <h2 style={{ marginTop: 24 }}>房型与价格</h2>
          {rooms.map((r, index) => (
            <div key={index} className="pc-form-row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
              <div className="pc-form-group">
                <label>房型名称</label>
                <input
                  placeholder="如：大床房"
                  value={r.type_name}
                  onChange={(e) => updateRooms(index, 'type_name', e.target.value)}
                />
              </div>
              <div className="pc-form-group">
                <label>基础价格（元）</label>
                <input
                  type="number"
                  min={0}
                  placeholder="299"
                  value={r.base_price}
                  onChange={(e) => updateRooms(index, 'base_price', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="pc-btn pc-btn-ghost pc-btn-sm"
                onClick={() => removeRow(setRooms, index)}
              >
                删除房型
              </button>
            </div>
          ))}
          <button
            type="button"
            className="pc-btn pc-btn-ghost pc-btn-sm"
            onClick={() => addRow(setRooms, { type_name: '', base_price: '' })}
          >
            + 添加房型
          </button>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button type="submit" className="pc-btn pc-btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
            <Link to={isEdit ? `/merchant/hotels/${id}` : '/merchant'} className="pc-btn pc-btn-ghost">
              取消
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
