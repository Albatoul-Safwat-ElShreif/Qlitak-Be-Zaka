import React, { useState } from 'react';
import './App.css';
import SmartCollegePage from './SmartCollegePage';
import ExperiencesPage from './ExperiencesPage';
import ScholarshipsPage from './ScholarshipsPage';
import headerImg from './assets/header.jfif';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // عرض صفحة "كليتك بذكاء" المستقلة
  if (currentPage === 'smart-college') {
    return <SmartCollegePage onBack={() => setCurrentPage('home')} />;
  }

  // عرض صفحة "قسم التجارب" المستقلة
  if (currentPage === 'experiences') {
    return <ExperiencesPage onBack={() => setCurrentPage('home')} />;
  }

  // عرض صفحة "قسم المنح" المستقلة
  if (currentPage === 'scholarships') {
    return <ScholarshipsPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="app-container" dir="rtl">
      {/* 1. الشريط العلوي (Navbar) */}
      <header className="navbar">
        <div
          className="logo"
          onClick={() => setCurrentPage('home')}
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-icon">🎓</span>
          <h2>كليتك بذكاء</h2>
        </div>

        <nav className="nav-links">
          <a
            href="#smart-college"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('smart-college');
            }}
          >
            كليتك بذكاء
          </a>
          <a
            href="#experiences"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('experiences');
            }}
          >
            قسم التجارب
          </a>
          <a
            href="#scholarships"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('scholarships');
            }}
          >
            قسم المنح
          </a>
        </nav>

        <button
          className="btn-login"
          onClick={() => setCurrentPage('smart-college')}
        >
          ابدأ الاختبار
        </button>
      </header>

      {/* 2. القسم التمهيدي للمشكلة (Hero Section) */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">دليلك الذكي للمستقبل الجامعي</span>
          <h1>حيرتك بعد الثانوية بتبدأ من هنا.. اختار طريقك صح!</h1>
          <p>
            آلاف من طلاب الثانوية بيختاروا كلياتهم بناءً على المجموع فقط أو كلام المحيطين، 
            وده بيسبب صدمة وتشتت في المستقبل. صممنا منصة "كليتك بذكاء" عشان نساعدك تكتشف 
            ميولك الحقيقية وتعرف واقع كل كلية قبل ما تاخد قرارك المصيري.
          </p>
          <div className="hero-actions">
            {}
            <a href="#problem-file" className="btn-primary">
              لمعرفة المزيد عن المشكلة والحل
            </a>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={headerImg}
            alt="طالب الثانوية يختار مستقبله الجامعي"
            className="hero-actual-img"
          />
        </div>
      </section>

      {/* 3. قسم الخدمات الثلاث (Cards Grid Section) */}
      <section className="services-section" id="services">
        <div className="section-title">
          <h2>ماذا نقدم لك في كليتك بذكاء؟</h2>
          <p>ثلاث أدوات متكاملة تضعك على الطريق الصحيح بثقة</p>
        </div>

        <div className="cards-grid">
          {/* الكارت الأول */}
          <div className="card" id="smart-college">
            <div className="card-icon">🧠</div>
            <h3>كليتك بذكاء</h3>
            <p>
              اكتشف التخصص الجامعي الأنسب لشخصيتك ومهاراتك من خلال تحليل ذكي يربط 
              بين قدراتك ومجموعك ومتطلبات سوق العمل المستقبلي.
            </p>
            <button
              className="btn-card"
              onClick={() => setCurrentPage('smart-college')}
            >
              ابدأ الاختبار الآن
            </button>
          </div>

          {/* الكارت الثاني */}
          <div className="card" id="experiences">
            <div className="card-icon">🗣️</div>
            <h3>قسم التجارب</h3>
            <p>
              اسمع الحقيقة من طلاب وخريجين عاشوا التجربة قبلك. اعرف صعوبات ومميزات 
              كل كلية بعيداً عن التوقعات المثالية.
            </p>
            <button
              className="btn-card"
              onClick={() => setCurrentPage('experiences')}
            >
              تصفح التجارب
            </button>
          </div>

          {/* الكارت الثالث */}
          <div className="card" id="scholarships">
            <div className="card-icon">🌍</div>
            <h3>قسم المنح</h3>
            <p>
              دليلك المحدث لأهم المنح الدراسية المحلية والدولية المتاحة لطلاب الثانوية، 
              مع شرح مبسط لشروط التقديم وخطوات القبول.
            </p>
            <button
              className="btn-card"
              onClick={() => setCurrentPage('scholarships')}
            >
              استكشف المنح
            </button>
          </div>
        </div>
      </section>

      {/* 4.   (Footer) */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🎓 كليتك بذكاء</h3>
            <p>نرافقك خطوة بخطوة نحو اختيار جامعي واعٍ ومستقبل مشرق.</p>
          </div>

          <div className="footer-links">
            <h4>أقسام المنصة</h4>
            <a
              href="#smart-college"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('smart-college');
              }}
            >
              كليتك بذكاء
            </a>
            <a
              href="#experiences"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('experiences');
              }}
            >
              قسم التجارب
            </a>
            <a
              href="#scholarships"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('scholarships');
              }}
            >
              قسم المنح
            </a>
          </div>

          <div className="footer-contact">
            <h4>تواصل معنا</h4>
            <p>info@kolyetak-smart.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة © 2026 منصة كليتك بذكاء</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
