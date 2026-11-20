import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

export function HomePage() {
  const { identity } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">CURATED LOCAL TRAVEL</p>
          <h1>不只是抵达，<br />而是进入一座城市。</h1>
          <p className="hero-lead">精选酒店与可信赖的本地地陪，让每一段旅程更真实、更从容。</p>
          <div className="hero-actions">
            <a className="button button-accent" href="#experiences">开始探索</a>
            {!identity && <Link className="button button-light" to="/register">成为会员</Link>}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="sun" />
          <div className="arch arch-back" />
          <div className="arch arch-front" />
          <div className="hero-note">TOKYO · 35.6762° N</div>
        </div>
      </section>

      <section className="experience-section" id="experiences">
        <div className="section-heading">
          <p className="eyebrow">HOW YOU TRAVEL</p>
          <h2>为你的停留，找到正确的人与地方。</h2>
        </div>
        <div className="experience-grid">
          <Link to="/hotels" className="experience-card hotel-card">
            <span className="card-index">01</span>
            <div><p>STAY</p><h3>精选酒店</h3><span>浏览真实房型与透明价格</span></div>
            <span className="card-arrow">↗</span>
          </Link>
          <Link to="/companions" className="experience-card companion-card">
            <span className="card-index">02</span>
            <div><p>MEET</p><h3>当地地陪</h3><span>按照兴趣和可用时间选择</span></div>
            <span className="card-arrow">↗</span>
          </Link>
          <article className="experience-card account-card">
            <span className="card-index">03</span>
            <div><p>PLAN</p><h3>{identity ? "查看账户" : "创建账户"}</h3><span>保存联络方式，为下单做好准备</span></div>
            <Link className="card-arrow" to={identity ? "/account" : "/register"} aria-label="继续">↗</Link>
          </article>
        </div>
      </section>
    </>
  );
}
