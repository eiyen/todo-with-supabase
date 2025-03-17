"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 登录处理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("请填写邮箱和密码");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "登录失败，请检查您的凭据");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-6">
      <nav className="navbar fixed top-0 left-0 right-0 justify-center">
        <div className="navbar-brand">任务清单</div>
      </nav>

      <div className="auth-container">
        <div className="auth-form">
          <h2 className="form-title">登录</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field pr-10"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link
                  href="#"
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  忘记密码?
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full btn btn-primary py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> 登录中...
                  </>
                ) : (
                  "登录"
                )}
              </button>
            </div>

            <div className="form-footer">
              还没有账号?{" "}
              <Link
                href="/auth/register"
                className="text-blue-500 hover:text-blue-700"
              >
                注册
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="back-link">
            <i className="fas fa-arrow-left mr-1"></i> 返回主页
          </Link>
        </div>
      </div>

      {/* Font Awesome CDN */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js" />
    </div>
  );
}
