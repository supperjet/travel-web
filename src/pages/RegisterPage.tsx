import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../auth/AuthProvider";
import type { RegistrationInput } from "../auth/types";
import { FormError } from "../components/FormError";
import { Button } from "../components/ui/Button";
import { SelectField, TextField } from "../components/ui/FormField";

const imApps = ["WHATSAPP", "WECHAT", "TELEGRAM", "LINE", "MESSENGER", "EMAIL"] as const;
const referralSources = ["SEARCH_ENGINE", "INSTAGRAM", "FRIEND_OR_COLLEAGUE", "HOTEL_CONCIERGE", "PRESS", "OTHER"] as const;
const registerSchema = z.object({
  firstName: z.string().trim().min(1, "请输入名字").max(80),
  lastName: z.string().trim().min(1, "请输入姓氏").max(80),
  email: z.string().trim().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少需要 8 个字符").max(128),
  imApp: z.enum(imApps),
  imId: z.string().trim().min(2, "请输入有效联络账号").max(120),
  referralSource: z.union([z.enum(referralSources), z.literal("")]),
  communicationsConsent: z.boolean().refine(Boolean, "请同意接收必要通知"),
  termsAccepted: z.boolean().refine(Boolean, "请同意服务条款与隐私政策"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { identity, register } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", imApp: "WHATSAPP", imId: "", referralSource: "",
      communicationsConsent: false, termsAccepted: false,
    },
  });

  if (identity) return <Navigate to="/account" replace />;

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    const input: RegistrationInput = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      imApp: values.imApp,
      imId: values.imId,
      communicationsConsent: true,
      termsAccepted: true,
      ...(values.referralSource ? { referralSource: values.referralSource } : {}),
    };
    try {
      await register(input);
      navigate("/account", { replace: true });
    } catch (cause) {
      setError(cause);
    } finally {
      setIsSubmitting(false);
    }
  });

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
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <FormError error={error} />
            <div className="field-row">
              <TextField label="名字" autoComplete="given-name" error={form.formState.errors.firstName?.message} {...form.register("firstName")} />
              <TextField label="姓氏" autoComplete="family-name" error={form.formState.errors.lastName?.message} {...form.register("lastName")} />
            </div>
            <TextField label="邮箱" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
            <TextField label="密码" type="password" autoComplete="new-password" hint="至少 8 个字符" error={form.formState.errors.password?.message} {...form.register("password")} />
            <div className="field-row">
              <SelectField label="常用联络方式" error={form.formState.errors.imApp?.message} {...form.register("imApp")}><option value="WHATSAPP">WhatsApp</option><option value="WECHAT">微信</option><option value="TELEGRAM">Telegram</option><option value="LINE">LINE</option><option value="MESSENGER">Messenger</option><option value="EMAIL">Email</option></SelectField>
              <TextField label="联络账号" placeholder="号码或用户名" error={form.formState.errors.imId?.message} {...form.register("imId")} />
            </div>
            <SelectField label="你从哪里知道我们？" {...form.register("referralSource")}><option value="">暂不填写</option><option value="SEARCH_ENGINE">搜索引擎</option><option value="INSTAGRAM">Instagram</option><option value="FRIEND_OR_COLLEAGUE">朋友或同事</option><option value="HOTEL_CONCIERGE">酒店礼宾</option><option value="PRESS">媒体</option><option value="OTHER">其他</option></SelectField>
            <label className="check-label"><input type="checkbox" {...form.register("communicationsConsent")} /><span>我同意接收与旅程和订单有关的必要通知。{form.formState.errors.communicationsConsent && <small role="alert">{form.formState.errors.communicationsConsent.message}</small>}</span></label>
            <label className="check-label"><input type="checkbox" {...form.register("termsAccepted")} /><span>我已阅读并同意服务条款与隐私政策。{form.formState.errors.termsAccepted && <small role="alert">{form.formState.errors.termsAccepted.message}</small>}</span></label>
            <Button block type="submit" disabled={isSubmitting}>{isSubmitting ? "正在创建…" : "创建账户"}</Button>
          </form>
          <p className="form-switch">已有账户？<Link to="/login">直接登录</Link></p>
        </div>
      </section>
    </div>
  );
}
