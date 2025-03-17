"use client";

import { useState } from "react";
import { Todo, TodoService } from "../lib/todo";

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.content);

  // 切换待办事项完成状态
  const toggleStatus = async () => {
    await TodoService.toggleTodoStatus(todo.id, todo.completed);
    onUpdate();
  };

  // 删除待办事项
  const deleteTodo = async () => {
    await TodoService.deleteTodo(todo.id);
    onUpdate();
  };

  // 保存编辑
  const saveTodo = async () => {
    if (editText.trim()) {
      await TodoService.updateTodo(todo.id, { content: editText });
      setIsEditing(false);
      onUpdate();
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditText(todo.content);
    setIsEditing(false);
  };

  return (
    <div className="todo-item">
      <div
        className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
        onClick={toggleStatus}
      ></div>

      {!isEditing ? (
        <>
          <div className={`todo-text ${todo.completed ? "completed" : ""}`}>
            {todo.content}
          </div>
          <div className="todo-actions">
            <button
              className="edit-btn text-blue-500 hover:text-blue-700"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="delete-btn text-red-500 hover:text-red-700"
              onClick={deleteTodo}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </>
      ) : (
        <div className="edit-form" style={{ display: "block", width: "100%" }}>
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="save-btn btn btn-primary btn-sm"
              onClick={saveTodo}
            >
              保存
            </button>
            <button
              className="cancel-btn btn btn-outline btn-sm"
              onClick={cancelEdit}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
