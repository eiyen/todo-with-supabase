"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Todo, TodoService } from "../lib/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  user: User;
}

export default function TodoList({ user }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 加载待办事项
  const loadTodos = async () => {
    setIsLoading(true);
    const todoList = await TodoService.getTodos(user.id);
    setTodos(todoList);
    setIsLoading(false);
  };

  // 添加新待办事项
  const addTodo = async () => {
    if (newTodoText.trim()) {
      await TodoService.addTodo(user.id, newTodoText);
      setNewTodoText("");
      loadTodos();
    }
  };

  // 初始加载
  useEffect(() => {
    loadTodos();
  }, [user.id]);

  // 处理按回车键添加
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <>
      <div className="todo-input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="添加新的待办事项..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-btn" onClick={addTodo}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="todo-list">
        {isLoading ? (
          <div className="text-center py-4">
            <i className="fas fa-spinner fa-spin mr-2"></i> 加载中...
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-list text-4xl mb-2 text-gray-300"></i>
            <p>暂无待办事项</p>
            <p className="text-sm mt-1">添加一些任务开始使用吧！</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
          ))
        )}
      </div>
    </>
  );
}
