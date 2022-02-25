import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTask = async () => {
      const taskFromServer = await fetchTasks();
      setTasks(taskFromServer);
    };

    getTask();
  }, []);

  //Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  };
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  };

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });

    /* const getTask = async () => {
      const taskFromServer = await fetchTask();
      setTasks(taskFromServer);
    };
    getTask();
    */
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToogle = await fetchTask(id);
    const updatedTask = { ...taskToToogle, reminder: !taskToToogle.reminder };

    const update = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await update.json();

    setTasks(tasks.map((task) => (task.id === id ? { ...data } : task)));
  };
  //Add Tasks
  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);
    /*
    const id = Math.floor(Math.random() * 100000);
    const newTask = { id, ...task };
    setTasks([...tasks, newTask]);
    */
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Route
          path="/"
          exact
          render={() => {
            return (
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length < 1 ? (
                  "No tasks available"
                ) : (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                )}
              </>
            );
          }}
        />

        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
