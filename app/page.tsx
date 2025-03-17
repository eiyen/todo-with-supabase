import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AppNavbar from "./components/AppNavbar";
import TodoList from "./components/TodoList";
import Link from "next/link";

// 导入Font Awesome样式
import Script from "next/script";

// 没有导入自定义样式，因为已经在layout.tsx中引入

export default async function Home() {
  try {
    // 获取Supabase客户端
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return (
      <div className="gradient-bg min-h-screen">
        <AppNavbar user={user} />

        <div className="container">
          <div className="todo-app">
            <div className="todo-header">
              <h2 className="todo-title">我的待办事项</h2>
            </div>

            <div className="todo-content">
              {user ? (
                <TodoList user={user} />
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">请登录以管理您的待办事项</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/auth/login" className="btn btn-primary">
                      登录
                    </Link>
                    <Link href="/auth/register" className="btn btn-outline">
                      注册
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Font Awesome CDN */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js" />
      </div>
    );
  } catch (error) {
    console.error("Error initializing app:", error);
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">出错了</h2>
          <p>初始化应用时发生错误，请稍后再试。</p>
          <div className="mt-4">
            <Link href="/" className="btn btn-primary">
              刷新页面
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
