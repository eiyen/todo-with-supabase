"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AppNavbarProps {
  user: User | null;
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const router = useRouter();

  // 退出登录
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">任务清单</div>
      <div className="navbar-nav">
        {user ? (
          <>
            <div className="user-welcome">
              欢迎, {user.email?.split("@")[0]}
            </div>
            <button className="nav-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt mr-1"></i> 退出
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="nav-btn">
              登录
            </Link>
            <Link href="/auth/register" className="nav-btn">
              注册
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
