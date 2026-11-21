import React, { useState } from 'react';
import initialScholarships from './scholarshipsData.json';

export default function ScholarshipsPage({ onBack }) {
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('الكل');
  const [selectedSch, setSelectedSch] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSch, setNewSch] = useState({
    title: '',
    location: 'داخل مصر',
    status: 'متاح الآن',
    funding: '',
    conditions: '',
    description: '',
    documentsText: '',
    applyUrl: ''
  });

  const filteredScholarships = scholarships.filter((sch) => {
    const matchesSearch =
      sch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.funding.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = locationFilter === 'الكل' || sch.location === locationFilter;
    return matchesSearch && matchesLoc;
  });

  const toggleDocCheck = (docName) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const docsArray = newSch.documentsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const itemToSave = {
      id: Date.now(),
      title: newSch.title,
      location: newSch.location,
      status: newSch.status,
      funding: newSch.funding,
      conditions: newSch.conditions,
      description: newSch.description,
      documents:
        docsArray.length > 0
          ? docsArray
          : ['بيان درجات الثانوية العامة', 'صورة البطاقة أو جواز السفر'],
      applyUrl: newSch.applyUrl || '#'
    };

    try {
      const response = await fetch('/api/save-scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave)
      });

      if (response.ok) {
        const result = await response.json();
        setScholarships(result.data);
        setShowAddModal(false);
        setNewSch({
          title: '',
          location: 'داخل مصر',
          status: 'متاح الآن',
          funding: '',
          conditions: '',
          description: '',
          documentsText: '',
          applyUrl: ''
        });
        alert('تم حفظ المنحة الجديدة بنجاح في ملف البيانات الدائم!');
      }
    } catch (error) {
      console.error('خطأ في حفظ المنحة:', error);
    }
  };

  return (
    <div className="smart-page-container" dir="rtl">
      {/* رأس الصفحة */}
      <div className="smart-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" className="btn-back" onClick={onBack}>
            ← العودة للرئيسية
          </button>
          <div>
            <h1>🌍 دليل المنح الدراسية الذكي</h1>
            <p>اكتشف المنح المتاحة داخل مصر وبالخارج وجهّز أوراقك للتقديم خطوة بخطوة</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + أضف منحة جديدة
        </button>
      </div>

      {/* شريط البحث والفلترة */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          className="score-input"
          style={{ flex: 1, minWidth: '250px' }}
          placeholder="🔍 ابحث باسم المنحة أو الجامعة أو الدولة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="branch-options" style={{ flex: 1 }}>
          {['الكل', 'داخل مصر', 'بالخارج'].map((loc) => (
            <button
              key={loc}
              type="button"
              className={`branch-btn ${locationFilter === loc ? 'active' : ''}`}
              onClick={() => setLocationFilter(loc)}
            >
              {loc === 'داخل مصر' ? '🇪🇬 داخل مصر' : loc === 'بالخارج' ? '🌍 بالخارج' : 'الكل'}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة بطاقات المنح */}
      <div className="cards-grid">
        {filteredScholarships.map((sch) => (
          <div key={sch.id} className="card" style={{ textAlign: 'right' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: sch.location === 'داخل مصر' ? '#dbeafe' : '#fef3c7',
                    color: sch.location === 'داخل مصر' ? '#1e40af' : '#b45309'
                  }}
                >
                  {sch.location === 'داخل مصر' ? '🇪🇬 داخل مصر' : '🌍 بالخارج'}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: sch.status === 'متاح الآن' ? '#15803d' : '#dc2626',
                    backgroundColor: sch.status === 'متاح الآن' ? '#dcfce7' : '#fee2e2',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px'
                  }}
                >
                  {sch.status}
                </span>
              </div>

              <h3>{sch.title}</h3>
              <p style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '0.95rem', margin: '0.5rem 0' }}>
                💰 {sch.funding}
              </p>
              <p style={{ fontSize: '0.88rem', color: '#475569' }}>
                📌 <strong>الشروط:</strong> {sch.conditions}
              </p>
            </div>

            <button
              type="button"
              className="btn-card"
              style={{ marginTop: '1.2rem', width: '100%' }}
              onClick={() => setSelectedSch(sch)}
            >
              التفاصيل والأوراق المطلوبة 📄
            </button>
          </div>
        ))}
      </div>

      {/* نافذة تفاصيل المنحة وقائمة الأوراق (Checklist) */}
      {selectedSch && (
        <div className="modal-overlay" onClick={() => setSelectedSch(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#1e3a8a' }}>{selectedSch.title}</h2>
              <span className="badge">{selectedSch.location}</span>
            </div>

            <p style={{ margin: '1rem 0', color: '#334155' }}>{selectedSch.description}</p>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <p><strong>💰 التمويل:</strong> {selectedSch.funding}</p>
              <p style={{ marginTop: '0.4rem' }}><strong>📌 الشروط الأساسية:</strong> {selectedSch.conditions}</p>
            </div>

            <h4 style={{ marginBottom: '0.6rem', color: '#0f172a' }}>
              ✅ قائمة تجهيز الأوراق المطلوبة (علّم على ما جهزته):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {selectedSch.documents.map((doc, idx) => (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem',
                    background: checkedDocs[doc] ? '#f0fdf4' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textDecoration: checkedDocs[doc] ? 'line-through' : 'none',
                    color: checkedDocs[doc] ? '#15803d' : '#1e293b'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[doc]}
                    onChange={() => toggleDocCheck(doc)}
                  />
                  {doc}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {selectedSch.applyUrl && selectedSch.applyUrl !== '#' && (
                <a
                  href={selectedSch.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ flex: 1, textAlign: 'center', fontSize: '0.95rem' }}
                >
                  🌐 الانتقال للموقع الرسمي
                </a>
              )}
              <button
                type="button"
                className="btn-back"
                onClick={() => setSelectedSch(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة منحة جديدة */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>➕ إضافة منحة دراسية جديدة</h2>
            <form
              onSubmit={handleAddSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}
            >
              <input
                type="text"
                className="score-input"
                placeholder="اسم المنحة والجهة المانحة"
                required
                value={newSch.title}
                onChange={(e) => setNewSch({ ...newSch, title: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <select
                  className="score-input"
                  value={newSch.location}
                  onChange={(e) => setNewSch({ ...newSch, location: e.target.value })}
                >
                  <option value="داخل مصر">داخل مصر</option>
                  <option value="بالخارج">بالخارج</option>
                </select>
                <select
                  className="score-input"
                  value={newSch.status}
                  onChange={(e) => setNewSch({ ...newSch, status: e.target.value })}
                >
                  <option value="متاح الآن">متاح الآن</option>
                  <option value="مغلق حالياً">مغلق حالياً</option>
                </select>
              </div>
              <input
                type="text"
                className="score-input"
                placeholder="نوع التمويل (مثلاً: تمويل كامل + راتب شهري)"
                required
                value={newSch.funding}
                onChange={(e) => setNewSch({ ...newSch, funding: e.target.value })}
              />
              <input
                type="text"
                className="score-input"
                placeholder="أهم الشروط (مثلاً: مجموع 90%+ وإجادة الإنجليزية)"
                required
                value={newSch.conditions}
                onChange={(e) => setNewSch({ ...newSch, conditions: e.target.value })}
              />
              <textarea
                className="score-input"
                placeholder="نبذة مختصرة عن المنحة"
                required
                rows="2"
                value={newSch.description}
                onChange={(e) => setNewSch({ ...newSch, description: e.target.value })}
              />
              <textarea
                className="score-input"
                placeholder="الأوراق المطلوبة (اكتب كل ورقة في سطر منفصل)"
                rows="3"
                value={newSch.documentsText}
                onChange={(e) => setNewSch({ ...newSch, documentsText: e.target.value })}
              />
              <input
                type="url"
                className="score-input"
                placeholder="رابط التقديم الرسمي (اختياري)"
                value={newSch.applyUrl}
                onChange={(e) => setNewSch({ ...newSch, applyUrl: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, border: 'none', cursor: 'pointer' }}
                >
                  حفظ المنحة في الملف
                </button>
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
