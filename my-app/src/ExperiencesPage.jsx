import React, { useState } from 'react';
import initialExperiences from './experiencesData.json';

export default function ExperiencesPage({ onBack }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('الكل');
  const [selectedExp, setSelectedExp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newExp, setNewExp] = useState({
    studentName: '',
    college: '',
    branch: 'علمي علوم',
    difficulty: 'متوسط',
    jobMarket: 'ممتازة',
    summary: '',
    realityVsExpectation: '',
    goldenAdvice: ''
  });

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'الكل' || exp.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const itemToSave = {
      ...newExp,
      id: Date.now()
    };

    try {
      const response = await fetch('/api/save-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave)
      });

      if (response.ok) {
        const result = await response.json();
        setExperiences(result.data);
        setShowAddModal(false);
        setNewExp({
          studentName: '',
          college: '',
          branch: 'علمي علوم',
          difficulty: 'متوسط',
          jobMarket: 'ممتازة',
          summary: '',
          realityVsExpectation: '',
          goldenAdvice: ''
        });
        alert('تم حفظ التجربة بنجاح في ملف البيانات الدائم!');
      }
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
    }
  };

  return (
    <div className="smart-page-container" dir="rtl">
      <div className="smart-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" className="btn-back" onClick={onBack}>
            ← العودة للرئيسية
          </button>
          <div>
            <h1>🗣️ تجارب حقيقية من قلب الكليات</h1>
            <p>اقرأ تجارب الطلاب والخريجين الحقيقية أو أضف تجربتك لتُحفظ في المنصة</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + شارك تجربتك
        </button>
      </div>

      {/* شريط البحث والفلترة */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          className="score-input"
          style={{ flex: 1, minWidth: '250px' }}
          placeholder="🔍 ابحث باسم الكلية (مثل: حاسبات، طب، ألسن...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="branch-options" style={{ flex: 1 }}>
          {['الكل', 'علمي علوم', 'علمي رياضة', 'أدبي'].map((b) => (
            <button
              key={b}
              type="button"
              className={`branch-btn ${selectedBranch === b ? 'active' : ''}`}
              onClick={() => setSelectedBranch(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="cards-grid">
        {filteredExperiences.map((exp) => (
          <div key={exp.id} className="card" style={{ textAlign: 'right' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span className="badge">{exp.branch}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>👤 {exp.studentName}</span>
              </div>
              <h3>{exp.college}</h3>
              <div style={{ fontSize: '0.85rem', color: '#475569', margin: '0.8rem 0' }}>
                <p>📊 <strong>الصعوبة:</strong> {exp.difficulty}</p>
                <p>💼 <strong>سوق العمل:</strong> {exp.jobMarket}</p>
              </div>
              <p style={{ fontStyle: 'italic', color: '#1e293b' }}>"{exp.summary}"</p>
            </div>
            <button
              type="button"
              className="btn-card"
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={() => setSelectedExp(exp)}
            >
              اقرأ التجربة كاملة
            </button>
          </div>
        ))}
      </div>

      {/* نافذة قراءة التفاصيل كاملة */}
      {selectedExp && (
        <div className="modal-overlay" onClick={() => setSelectedExp(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedExp.college}</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              بواسطة: <strong>{selectedExp.studentName}</strong> ({selectedExp.branch})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4>🔍 التوقعات قبل الكلية vs الواقع:</h4>
                <p>{selectedExp.realityVsExpectation}</p>
              </div>
              <div>
                <h4>💡 النصيحة الذهبية لطلاب الثانوية:</h4>
                <p>{selectedExp.goldenAdvice}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-login"
              style={{ marginTop: '1.5rem', width: '100%' }}
              onClick={() => setSelectedExp(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نافذة إضافة تجربة جديدة */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>✍️ أضف تجربتك الجامعية</h2>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              <input
                type="text"
                className="score-input"
                placeholder="اسمك (أو اسم مستعار)"
                required
                value={newExp.studentName}
                onChange={(e) => setNewExp({ ...newExp, studentName: e.target.value })}
              />
              <input
                type="text"
                className="score-input"
                placeholder="اسم الكلية والجامعة"
                required
                value={newExp.college}
                onChange={(e) => setNewExp({ ...newExp, college: e.target.value })}
              />
              <select
                className="score-input"
                value={newExp.branch}
                onChange={(e) => setNewExp({ ...newExp, branch: e.target.value })}
              >
                <option value="علمي علوم">علمي علوم</option>
                <option value="علمي رياضة">علمي رياضة</option>
                <option value="أدبي">أدبي</option>
              </select>
              <input
                type="text"
                className="score-input"
                placeholder="مستوى الصعوبة (مثلاً: متوسط، يحتاج مجهود)"
                required
                value={newExp.difficulty}
                onChange={(e) => setNewExp({ ...newExp, difficulty: e.target.value })}
              />
              <input
                type="text"
                className="score-input"
                placeholder="فرص سوق العمل (مثلاً: ممتازة، متوسطة)"
                required
                value={newExp.jobMarket}
                onChange={(e) => setNewExp({ ...newExp, jobMarket: e.target.value })}
              />
              <textarea
                className="score-input"
                placeholder="ملخص التجربة في سطرين"
                required
                rows="2"
                value={newExp.summary}
                onChange={(e) => setNewExp({ ...newExp, summary: e.target.value })}
              />
              <textarea
                className="score-input"
                placeholder="ما الذي توقعته قبل الكلية وما الواقع الحقيقي؟"
                required
                rows="3"
                value={newExp.realityVsExpectation}
                onChange={(e) => setNewExp({ ...newExp, realityVsExpectation: e.target.value })}
              />
              <textarea
                className="score-input"
                placeholder="نصيحتك الذهبية لطالب الثانوية"
                required
                rows="2"
                value={newExp.goldenAdvice}
                onChange={(e) => setNewExp({ ...newExp, goldenAdvice: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, border: 'none', cursor: 'pointer' }}>
                  حفظ ونشر التجربة
                </button>
                <button type="button" className="btn-back" onClick={() => setShowAddModal(false)}>
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
