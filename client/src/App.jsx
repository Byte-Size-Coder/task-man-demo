// client/src/App.js
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;

    await axios.post(`${API_URL}/tasks`, { text });
    setText("");
    fetchTasks();
  };

  const markComplete = async (id) => {
    await axios.put(`${API_URL}/tasks/${id}/complete`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="app">
      <h1 className="app-title">Task Man 2.1</h1>
      <div className="task-input-row">
        <input
          className="task-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>Add</button>
      </div>
      <div className="task-list">
        {tasks.map((t) => (
          <div key={t._id} className="task-card">
            <p className={`task-text ${t.completed ? "task-text-completed" : ""}`}>
              {t.text}
            </p>
            <div className="task-actions">
              <button
                onClick={() => markComplete(t._id)}
                disabled={t.completed}
                className="action-button"
              >
                Complete
              </button>
              <button
                onClick={() => deleteTask(t._id)}
                className="action-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;