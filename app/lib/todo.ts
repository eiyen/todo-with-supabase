import { createClient } from "@supabase/supabase-js";

// 初始化Supabase客户端 - 客户端版本
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 待办事项类型定义
export interface Todo {
  id: string;
  user_id: string;
  content: string;
  completed: boolean;
  created_at: string;
}

// 工具函数
export const TodoUtils = {
  /**
   * 格式化日期
   * @param date - 日期对象
   * @returns 格式化后的日期字符串
   */
  formatDate: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * 生成唯一ID
   * @returns 唯一ID
   */
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },
};

// 待办事项服务
export const TodoService = {
  /**
   * 获取用户的所有待办事项
   * @param userId - 用户ID
   * @returns 待办事项列表Promise
   */
  getTodos: async (userId: string): Promise<Todo[]> => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTodos:", error);
      return [];
    }
  },

  /**
   * 添加新的待办事项
   * @param userId - 用户ID
   * @param content - 待办事项内容
   * @returns 新添加的待办事项Promise
   */
  addTodo: async (userId: string, content: string): Promise<Todo | null> => {
    try {
      const newTodo = {
        user_id: userId,
        content,
        completed: false,
      };

      const { data, error } = await supabase
        .from("todos")
        .insert([newTodo])
        .select()
        .single();

      if (error) {
        console.error("Error adding todo:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in addTodo:", error);
      return null;
    }
  },

  /**
   * 更新待办事项
   * @param todoId - 待办事项ID
   * @param updates - 待更新的字段
   * @returns 更新后的待办事项Promise
   */
  updateTodo: async (
    todoId: string,
    updates: Partial<Todo>
  ): Promise<Todo | null> => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", todoId)
        .select()
        .single();

      if (error) {
        console.error("Error updating todo:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateTodo:", error);
      return null;
    }
  },

  /**
   * 删除待办事项
   * @param todoId - 待办事项ID
   * @returns 是否删除成功
   */
  deleteTodo: async (todoId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", todoId);

      if (error) {
        console.error("Error deleting todo:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteTodo:", error);
      return false;
    }
  },

  /**
   * 切换待办事项完成状态
   * @param todoId - 待办事项ID
   * @param currentStatus - 当前完成状态
   * @returns 更新后的待办事项Promise
   */
  toggleTodoStatus: async (
    todoId: string,
    currentStatus: boolean
  ): Promise<Todo | null> => {
    return TodoService.updateTodo(todoId, { completed: !currentStatus });
  },
};
