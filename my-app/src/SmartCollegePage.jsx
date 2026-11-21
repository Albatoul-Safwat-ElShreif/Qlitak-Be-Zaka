import React, { useState, useEffect } from 'react';
import { collegesData } from './collegesData';

const mbtiTypes = [
  { code: 'ISTJ', name: 'المفتش', desc: 'منظم، ملتزم بالتفاصيل' },
  { code: 'ISFJ', name: 'الحامي', desc: 'راعي، مهتم بالآخرين' },
  { code: 'INFJ', name: 'المستشار', desc: 'حساس، يملك رؤية مستقبلية' },
  { code: 'INTJ', name: 'العقل المدبر', desc: 'مخطط ومبدع استراتيجي' },
  { code: 'ISTP', name: 'الحرفي', desc: 'عملي، يحب التجربة والمهارة' },
  { code: 'ISFP', name: 'الفنان', desc: 'مبدع وحساس جمالياً' },
  { code: 'INFP', name: 'المثالي', desc: 'قيم قوية وابتكار' },
  { code: 'INTP', name: 'المفكر', desc: 'محب للتحليل والنظرية' },
  { code: 'ESTP', name: 'المبادر', desc: 'سريع، عملي ومباشر' },
  { code: 'ESFP', name: 'المؤدي', desc: 'اجتماعي، يحب الظهور والتجربة' },
  { code: 'ENFP', name: 'الملهم', desc: 'مبتكر وحيوي' },
  { code: 'ENTP', name: 'المبدع', desc: 'فكرة سريعة ومجادل' },
  { code: 'ESTJ', name: 'المشرف', desc: 'منظم وقائد بالفطرة' },
  { code: 'ESFJ', name: 'المزود', desc: 'مراعي، يعمل من أجل الفريق' },
  { code: 'ENFJ', name: 'المعطي', desc: 'قائد داعم ومشجع' },
  { code: 'ENTJ', name: 'القائد', desc: 'طموح واستراتيجي' }
];

const descriptions = {
  'اقتصاد و علوم سياسية القاهرة': 'تخصص يهتم بالعلوم الاقتصادية والسياسية والعلاقات الدولية.',
  'ألسن كفر الشيخ': 'تخصص في اللغات والترجمة والدراسات اللغوية.',
  'هندسة بترول و تعدين السويس': 'تخصص في هندسة البترول والتعدين والطاقة.',
  'طب القاهرة': 'الدراسة الطبية الشاملة في مختلف التخصصات الطبية.',
  'إعلام القاهرة': 'تخصص في الصحافة والإذاعة والتلفزيون والعلاقات العامة.',
  'حقوق القاهرة': 'دراسة القانون والنظم التشريعية والمحاماة.',
  'هندسة القاهرة': 'تخصص في مختلف فروع الهندسة والتكنولوجيا.',
  'صيدلة القاهرة': 'تخصص في الأدوية والعلوم الصيدلانية.',
  'آداب القاهرة': 'تخصص في الأدب واللغات والعلوم الإنسانية.',
  'حاسبات ومعلومات القاهرة': 'تخصص في البرمجة والذكاء الاصطناعي وتطوير الأنظمة.'
};

export default function SmartCollegePage({ onBack }) {
  const [branch, setBranch] = useState('');
  const [score, setScore] = useState('');
  const [selectedMbti, setSelectedMbti] = useState('');
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lastInput');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.branch) setBranch(parsed.branch);
        if (parsed.score) setScore(parsed.score);
        if (parsed.mbti) setSelectedMbti(parsed.mbti);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const calculateCompatibility = (college, studentScore, mbti) => {
    let comp = 70;
    const diff = studentScore - college.min_score;
    if (diff >= 0) {
      if (diff > 50) comp += 25;
      else if (diff > 30) comp += 20;
      else if (diff > 10) comp += 15;
      else comp += 10;
    } else {
      if (diff > -10) comp += 5;
      else if (diff > -20) comp += 0;
      else comp -= 5;
    }
    if (college.personalities.includes(mbti)) comp += 15;
    return Math.min(95, Math.max(40, comp));
  };

  const handleShowResult = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const numScore = parseInt(score, 10);

    if (!branch) { setErrorMsg('من فضلك اختر الشعبة الدراسية أولاً.'); return; }
    if (!numScore || numScore < 1 || numScore > 320) { setErrorMsg('من فضلك أدخل درجة صحيحة بين 1 و 320.'); return; }
    if (!selectedMbti) { setErrorMsg('من فضلك اختر نوع شخصيتك من القائمة.'); return; }

    localStorage.setItem('lastInput', JSON.stringify({ branch, score: numScore, mbti: selectedMbti }));

    const dataType = branch === 'arts' ? 'literary' : 'scientific';
    const allColleges = collegesData[dataType] || [];

    const matched = allColleges
      .filter((c) => c.personalities.includes(selectedMbti))
      .map((c) => ({
        ...c,
        scoreDifference: Math.abs(numScore - c.min_score),
        isAbove: numScore >= c.min_score,
        compatibility: calculateCompatibility(c, numScore, selectedMbti)
      }))
      .sort((a, b) => {
        if (a.isAbove !== b.isAbove) return a.isAbove ? -1 : 1;
        return a.scoreDifference - b.scoreDifference;
      })
      .slice(0, 10);

    let totalScore = 40;
    if (matched.length > 0) {
      const avg = matched.reduce((sum, c) => sum + c.compatibility, 0) / matched.length;
      totalScore = Math.min(95, Math.max(40, Math.round(avg)));
    }

    setResults({
      branch,
      score: numScore,
      mbti: selectedMbti,
      mbtiInfo: mbtiTypes.find((t) => t.code === selectedMbti),
      colleges: matched,
      totalScore
    });
  };
  return (
    <div className="smart-page-container" dir="rtl">
      <div className="smart-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← العودة للرئيسية
        </button>
        <div>
          <h1>🧠 مستشارك الذكي: كليتك بذكاء</h1>
          <p>اجمع بين مجموعك ونمط شخصيتك (MBTI) لاكتشاف الكليات الأنسب لك وخطة مهاراتك</p>
        </div>
      </div>

      <div className="smart-layout">
        <form className="smart-form-card" onSubmit={handleShowResult}>
          <h3>1. اختر الشعبة الدراسية</h3>
          <div className="branch-options">
            <label className={`branch-btn ${branch === 'sci-bio' ? 'active' : ''}`}>
              <input
                type="radio"
                name="branch"
                value="sci-bio"
                checked={branch === 'sci-bio'}
                onChange={(e) => setBranch(e.target.value)}
              />
              🧬 علمي علوم
            </label>
            <label className={`branch-btn ${branch === 'sci-math' ? 'active' : ''}`}>
              <input
                type="radio"
                name="branch"
                value="sci-math"
                checked={branch === 'sci-math'}
                onChange={(e) => setBranch(e.target.value)}
              />
              📐 علمي رياضة
            </label>
            <label className={`branch-btn ${branch === 'arts' ? 'active' : ''}`}>
              <input
                type="radio"
                name="branch"
                value="arts"
                checked={branch === 'arts'}
                onChange={(e) => setBranch(e.target.value)}
              />
              📚 أدبي
            </label>
          </div>

          <h3>2. اكتب درجتك (من 320)</h3>
          <input
            type="number"
            className="score-input"
            placeholder="مثال: 285"
            min="1"
            max="320"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          <h3>3. اختر نوع شخصيتك (16 نمط MBTI)</h3>
          <p className="mbti-hint">
            * اختر النمط الذي يمثلك من البطاقات التالية للحصول على أدق ترشيح.
          </p>
          <div className="mbti-selection-grid">
            {mbtiTypes.map((t) => (
              <div
                key={t.code}
                className={`mbti-item ${selectedMbti === t.code ? 'selected' : ''}`}
                onClick={() => setSelectedMbti(t.code)}
              >
                <div className="mbti-item-code">{t.code}</div>
                <div className="mbti-item-name">{t.name}</div>
                <div className="mbti-item-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          {errorMsg && <div className="error-box">{errorMsg}</div>}

          <button type="submit" className="btn-submit-test">
            ✨ عرض الكليات المقترحة وخطة المهارات
          </button>
        </form>

        <div className="smart-results-card">
          {!results ? (
            <div className="empty-results">
              <span>🎯</span>
              <h3>نتائجك ستظهر هنا</h3>
              <p>اختر شعبتك، اكتب درجتك، وحدد نمط شخصيتك ثم اضغط على زر عرض النتائج.</p>
            </div>
          ) : (
            <div className="results-content">
              <div className="results-summary">
                <h2>📊 ملخص التحليل الذكي</h2>
                <div className="summary-badges">
                  <span>
                    الشخصية: <strong>{results.mbti} ({results.mbtiInfo?.name})</strong>
                  </span>
                  <span>
                    الشعبة:{' '}
                    <strong>
                      {results.branch === 'sci-bio'
                        ? 'علمي علوم'
                        : results.branch === 'sci-math'
                        ? 'علمي رياضة'
                        : 'أدبي'}
                    </strong>
                  </span>
                  <span>
                    الدرجة: <strong>{results.score} / 320</strong>
                  </span>
                </div>

                <div className="compatibility-bar-wrap">
                  <div className="bar-label">
                    <span>نسبة التوافق العامة</span>
                    <strong>{results.totalScore}%</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${results.totalScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <h3>🏛️ الكليات المقترحة لك ({results.colleges.length})</h3>
              {results.colleges.length === 0 ? (
                <p className="no-match">
                  لم نجد كليات مطابقة تماماً لهذه البيانات، جرب تعديل الاختيارات.
                </p>
              ) : (
                <div className="colleges-list">
                  {results.colleges.map((col, idx) => {
                    const isRecommended = col.compatibility >= 70;
                    const diff = results.score - col.min_score;
                    return (
                      <div
                        key={idx}
                        className={`college-item ${isRecommended ? 'recommended' : ''}`}
                      >
                        <div className="college-item-top">
                          <h4>{col.college}</h4>
                          <span className={`badge-tag ${isRecommended ? 'gold' : 'blue'}`}>
                            {isRecommended ? '🏆 موصى بها' : '💡 بديل جيد'}
                          </span>
                        </div>
                        <div className="college-metrics">
                          <span>
                            الحد الأدنى: <strong>{col.min_score}</strong>
                          </span>
                          <span>
                            نسبة التوافق: <strong>{Math.round(col.compatibility)}%</strong>
                          </span>
                          <span className={diff >= 0 ? 'diff-pos' : 'diff-neg'}>
                            {diff >= 0
                              ? `✅ أعلى بـ ${diff} درجة`
                              : `⚠️ أقل بـ ${Math.abs(diff)} درجة`}
                          </span>
                        </div>
                        <p className="college-desc">
                          {descriptions[col.college] ||
                            `كلية ${col.college} تتوافق مع سمات شخصيتك (${results.mbti}).`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="skills-plan-box">
                <h3>📚 خطة المهارات المقترحة لتجهيزك</h3>
                <ul>
                  {results.branch === 'arts' ? (
                    <>
                      <li>
                        <strong>دورات أساسية:</strong> اللغة الإنجليزية، الكتابة الأكاديمية، والعلوم الاجتماعية.
                      </li>
                      <li>
                        <strong>مهارات عملية:</strong> البحث العلمي، مهارات الإلقاء والعرض التقديمي، والتحليل النقدي.
                      </li>
                      <li>
                        <strong>مهارات تقنية:</strong> إتقان برامج الأوفيس وتحليل البيانات الأساسية.
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <strong>دورات أساسية:</strong> تقوية الأساسيات في الرياضيات، الكيمياء، أو الفيزياء حسب تخصصك.
                      </li>
                      <li>
                        <strong>مهارات عملية:</strong> البحث العلمي، التفكير المنطقي، وحل المشكلات المعقدة.
                      </li>
                      <li>
                        <strong>مهارات تقنية:</strong> أساسيات البرمجة، الإحصاء، وتحليل البيانات.
                      </li>
                    </>
                  )}
                  <li>
                    <strong>مهارات شخصية:</strong> إدارة الوقت، العمل الجماعي، والقيادة.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
