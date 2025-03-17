/**
 * 燎辉Todo - 共享 JavaScript 功能
 */

// 工具函数
const TodoUtils = {
  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} - 格式化后的日期字符串
   */
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * 生成唯一ID
   * @returns {string} - 唯一ID
   */
  generateId: function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 存储数据到本地存储
   * @param {string} key - 存储键
   * @param {any} data - 要存储的数据
   */
  saveToLocalStorage: function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  /**
   * 从本地存储获取数据
   * @param {string} key - 存储键
   * @returns {any} - 获取的数据
   */
  getFromLocalStorage: function (key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
};

// 模拟用户认证
const AuthService = {
  /**
   * 检查用户是否已登录
   * @returns {boolean} - 是否已登录
   */
  isLoggedIn: function () {
    return !!localStorage.getItem("user");
  },

  /**
   * 获取当前登录用户
   * @returns {object|null} - 用户信息
   */
  getCurrentUser: function () {
    return TodoUtils.getFromLocalStorage("user");
  },

  /**
   * 模拟登录
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise} - 登录结果
   */
  login: function (email, password) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求延迟
      setTimeout(() => {
        // 这里只是模拟，实际应用中需要与服务器交互
        if (email && password) {
          const user = {
            id: TodoUtils.generateId(),
            email: email,
            name: email.split("@")[0],
          };

          TodoUtils.saveToLocalStorage("user", user);
          resolve(user);
        } else {
          reject(new Error("邮箱或密码不能为空"));
        }
      }, 800);
    });
  },

  /**
   * 模拟注册
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} code - 验证码
   * @returns {Promise} - 注册结果
   */
  register: function (email, password, code) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求延迟
      setTimeout(() => {
        // 这里只是模拟，实际应用中需要与服务器交互
        if (email && password && code) {
          const user = {
            id: TodoUtils.generateId(),
            email: email,
            name: email.split("@")[0],
          };

          resolve(user);
        } else {
          reject(new Error("请填写完整的注册信息"));
        }
      }, 800);
    });
  },

  /**
   * 退出登录
   */
  logout: function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  },
};

// 待办事项管理
const TodoService = {
  /**
   * 获取所有待办事项
   * @returns {Array} - 待办事项列表
   */
  getTodos: function () {
    return TodoUtils.getFromLocalStorage("todos") || [];
  },

  /**
   * 添加新的待办事项
   * @param {string} text - 待办事项内容
   * @returns {object} - 新添加的待办事项
   */
  addTodo: function (text) {
    const todos = this.getTodos();
    const newTodo = {
      id: TodoUtils.generateId(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    TodoUtils.saveToLocalStorage("todos", todos);

    return newTodo;
  },

  /**
   * 更新待办事项
   * @param {string} id - 待办事项ID
   * @param {object} updates - 要更新的字段
   * @returns {object|null} - 更新后的待办事项
   */
  updateTodo: function (id, updates) {
    const todos = this.getTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      TodoUtils.saveToLocalStorage("todos", todos);
      return todos[index];
    }

    return null;
  },

  /**
   * 删除待办事项
   * @param {string} id - 待办事项ID
   * @returns {boolean} - 是否删除成功
   */
  deleteTodo: function (id) {
    const todos = this.getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length !== todos.length) {
      TodoUtils.saveToLocalStorage("todos", filteredTodos);
      return true;
    }

    return false;
  },

  /**
   * 切换待办事项完成状态
   * @param {string} id - 待办事项ID
   * @returns {object|null} - 更新后的待办事项
   */
  toggleTodoStatus: function (id) {
    const todos = this.getTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index !== -1) {
      todos[index].completed = !todos[index].completed;
      TodoUtils.saveToLocalStorage("todos", todos);
      return todos[index];
    }

    return null;
  },
};

// 导出模块
window.TodoApp = {
  utils: TodoUtils,
  auth: AuthService,
  todos: TodoService,
};
