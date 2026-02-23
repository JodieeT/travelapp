import { useEffect, useState } from 'react';

export function ImageViewer({ images, getImageUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowLeft') setCurrentIndex(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrentIndex(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!images || images.length === 0) return null;

  const openViewer = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeViewer = () => setIsOpen(false);

  if (!isOpen) {
    return (
      <div style={{ marginBottom: 20 }}>
        <p><strong>图片：</strong></p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={getImageUrl(img)}
              alt={`酒店图片${idx + 1}`}
              style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
              onClick={() => openViewer(idx)}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={closeViewer}
    >
      <button
        onClick={() => setCurrentIndex(i => (i - 1 + images.length) % images.length)}
        style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
          fontSize: 24, padding: '10px 15px', cursor: 'pointer', borderRadius: 4
        }}
      >
        ‹
      </button>
      <img
        src={getImageUrl(images[currentIndex])}
        alt={`预览${currentIndex + 1}`}
        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={() => setCurrentIndex(i => (i + 1) % images.length)}
        style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
          fontSize: 24, padding: '10px 15px', cursor: 'pointer', borderRadius: 4
        }}
      >
        ›
      </button>
      <div style={{ position: 'absolute', bottom: 20, color: '#fff', fontSize: 14 }}>
        {currentIndex + 1} / {images.length}
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20, color: '#fff', fontSize: 14, cursor: 'pointer' }} onClick={closeViewer}>
        ✕ 关闭 (ESC)
      </div>
    </div>
  );
}
