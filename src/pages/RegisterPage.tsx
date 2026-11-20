import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import type { ImApp, RegistrationInput } from "../auth/types";
import { FormError } from "../components/FormError";

export function RegisterPage() {
  const { identity, register } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (identity) return <Navigate to="/account" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);
    const referralSource = String(data.get("referralSource") ?? "");
    const input: RegistrationInput = {
      email: String(data.get("email")),
      password: String(data.get("password")),
      firstName: String(data.get("firstName")),
      lastName: String(data.get("lastName")),
      imApp: String(data.get("imApp")) as ImApp,
      imId: String(data.get("imId")),
      communicationsConsent: true,
      termsAccepted: true,
      ...(referralSource ? { referralSource: referralSource as RegistrationInput["referralSource"] } : {}),
    };
    try {
      await register(input);
      navigate("/account", { replace: true });
    } catch (cause) {
      setError(cause);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout register-layout">
      <section className="auth-aside">
        <p className="eyebrow">JOIN THE LOOP</p>
        <h1>让每次抵达，<br />都有当地回应。</h1>
        <p>注册后可以保存联络信息，并创建不可重复提交的安全订单。</p>
        <ol className="join-steps"><li>真实透明的服务价格</li><li>当地地陪档期实时确认</li><li>统一的旅程支持</li></ol>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap register-form-wrap">
          <p className="eyebrow">CREATE YOUR ACCOUNT</p>
          <h2>创建账户</h2>
          <p className="form-intro">我们会使用这些信息完成订单联络。</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <FormError error={error} />
            <div className="field-row">
              <label>名字<input name="firstName" autoComplete="given-name" minLength={1} maxLength={80} required /></label>
              <label>姓氏<input name="lastName" autoComplete="family-name" minLength={1} maxLength={80} required /></label>
            </div>
            <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
            <label>密码<input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /><small>至少 8 个字符</small></label>
            <div className="field-row">
              <label>常用联络方式<select name="imApp" defaultValue="WHATSAPP" required><option value="WHATSAPP">WhatsApp</option><option value="WECHAT">微信</option><option value="TELEGRAM">Telegram</option><option value="LINE">LINE</option><option value="MESSENGER">Messenger</option><option value="EMAIL">Email</option></select></label>
              <label>联络账号<input name="imId" placeholder="号码或用户名" minLength={2} maxLength={120} required /></label>
            </div>
            <label>你从哪里知道我们？<select name="referralSource" defaultValue=""><option value="">暂不填写</option><option value="SEARCH_ENGINE">搜索引擎</option><option value="INSTAGRAM">Instagram</option><option value="FRIEND_OR_COLLEAGUE">朋友或同事</option><option value="HOTEL_CONCIERGE">酒店礼宾</option><option value="PRESS">媒体</option><option value="OTHER">其他</option></select></label>
            <label className="check-label"><input name="communicationsConsent" type="checkbox" required /><span>我同意接收与旅程和订单有关的必要通知。</span></label>
            <label className="check-label"><input name="termsAccepted" type="checkbox" required /><span>我已阅读并同意服务条款与隐私政策。</span></label>
            <button className="button button-dark button-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "正在创建…" : "创建账户"}</button>
          </form>
          <p className="form-switch">已有账户？<Link to="/login">直接登录</Link></p>
        </div>
      </section>
    </div>
  );
}
