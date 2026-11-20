import { useAuth } from "../auth/AuthProvider";

export function AccountPage() {
  const { identity } = useAuth();
  if (!identity) return null;
  const { user, roles } = identity;

  return (
    <section className="account-page">
      <div className="account-heading">
        <p className="eyebrow">YOUR LOCALLOOP</p>
        <h1>你好，{user.profile.firstName}。</h1>
        <p>你的账户已连接到 travel-api 测试环境。</p>
      </div>
      <div className="account-grid">
        <article className="profile-card">
          <div className="avatar">{user.profile.firstName.charAt(0)}{user.profile.lastName.charAt(0)}</div>
          <div><p className="card-label">PROFILE</p><h2>{user.name}</h2><p>{user.email}</p></div>
          <span className="status-pill">已登录</span>
        </article>
        <article className="detail-card"><p className="card-label">CONTACT</p><dl><div><dt>联络方式</dt><dd>{user.profile.imApp}</dd></div><div><dt>账号</dt><dd>{user.profile.imId}</dd></div></dl></article>
        <article className="detail-card"><p className="card-label">ACCESS</p><dl><div><dt>角色</dt><dd>{roles.join(" · ")}</dd></div><div><dt>条款状态</dt><dd>{user.profile.termsAccepted ? "已接受" : "未接受"}</dd></div></dl></article>
      </div>
      <div className="next-step-banner"><span>下一步</span><strong>酒店与地陪目录将在这里接入。</strong><p>认证链路已经打通，接下来可以把真实服务数据带进页面。</p></div>
    </section>
  );
}
