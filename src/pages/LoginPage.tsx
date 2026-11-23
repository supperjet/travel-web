import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../auth/AuthProvider";
import { FormError } from "../components/FormError";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/FormField";

const loginSchema = z.object({
  email: z.string().trim().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少需要 8 个字符"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { identity, login } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? "/account";
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (identity) return <Navigate to={destination} replace />;

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(destination, { replace: true });
    } catch (cause) {
      setError(cause);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="auth-layout">
      <section className="auth-aside">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>继续你的<br />LocalLoop 旅程。</h1>
        <p>登录后查看个人资料，并继续浏览酒店、地陪与订单。</p>
        <div className="aside-coordinate">34.6937° N · 135.5023° E</div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">MEMBER SIGN IN</p>
          <h2>登录</h2>
          <p className="form-intro">使用注册邮箱继续。</p>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <FormError error={error} />
            <TextField label="邮箱" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
            <TextField label="密码" type="password" autoComplete="current-password" error={form.formState.errors.password?.message} {...form.register("password")} />
            <Button block type="submit" disabled={isSubmitting}>
              {isSubmitting ? "正在登录…" : "登录"}
            </Button>
          </form>
          <p className="form-switch">还没有账户？<Link to="/register">立即注册</Link></p>
        </div>
      </section>
    </div>
  );
}
