// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  await newTask.save();
  res.json(newTask);
});

app.put("/tasks/:id/complete", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);

  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));