import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// ✅ FIX 1: Always use relative path (works in Docker/K8s)
const API = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setLoading(false);
  };

  const addTodo = async () => {
  if (!title.trim()) {
    alert('Please enter a title');
    return;
  }

  try {
    await axios.post(API, {
      title,
      description,
    });

    await fetchTodos(); // ✅ important fix

    setTitle('');
    setDescription('');
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Failed to add todo');
  }
};

  const startEdit = (todo) => {
    setEditingId(todo.id); // ✅ FIXED (_id → id)
    setEditTitle(todo.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`${API}/${editingId}`, {
        title: editTitle,
      });
      setTodos(todos.map(todo => (todo.id === editingId ? response.data.data : todo))); // ✅ FIXED
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${API}/${id}`, {
        completed: !currentStatus,
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data.data : todo))); // ✅ FIXED
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`${API}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id)); // ✅ FIXED
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  return (
    <div className="container">
      <h1>📝 My Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <textarea
          placeholder="Add description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
        ></textarea>
        <button onClick={addTodo} className="add-btn">+ Add Todo</button>
      </div>

      <div className="todo-list">
        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No todos yet. Add one to get started!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id}>
              {editingId === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit} className="save-btn">💾 Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">❌ Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)} // ✅ FIXED
                      className="checkbox"
                    />
                    <div className="todo-text">
                      <h3>{todo.title}</h3>
                      {todo.description && <p>{todo.description}</p>}
                    </div>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => startEdit(todo)} className="edit-btn">✏️</button>
                    <button onClick={() => deleteTodo(todo.id)} className="delete-btn">🗑️</button> {/* ✅ FIXED */}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;