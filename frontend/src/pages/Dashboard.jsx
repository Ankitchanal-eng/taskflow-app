import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editData, setEditData] = useState({ title: '', status: '' });

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    status: 'pending',
  });

  const [statusFilter, setStatusFilter] = useState('All');

  // auth state from token
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTasks([]);
    navigate('/login');
  };

  // auth error helper
  const checkAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      handleLogout();
      return true;
    }
    return false;
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      if (checkAuthError(err)) return;
      setError('Failed to fetch tasks.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasToken = !!localStorage.getItem('token');
    setIsAuthenticated(hasToken);

    if (hasToken) {
      // only fetch tasks for logged-in users
      fetchTasks();
    } else {
      // guest: no API call, just stop loading
      setLoading(false);
      setTasks([]);
    }
  }, []);

  const onNewTaskChange = (e) => {
    setNewTaskData({ ...newTaskData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;

    try {
      const res = await api.post('/api/tasks', {
        title: newTaskData.title,
        status: newTaskData.status,
      });

      setTasks([res.data, ...tasks]);
      setNewTaskData({ title: '', status: 'pending' });
      setError('');
    } catch (err) {
      if (checkAuthError(err)) return;
      console.error('Task creation error:', err);
      setError('Failed to create task.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditData({ title: task.title, status: task.status });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditData({ title: '', status: '' });
  };

  const handleUpdateTask = async (taskId) => {
    if (!editData.title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    try {
      const res = await api.put(`/api/tasks/${taskId}`, {
        title: editData.title,
        status: editData.status,
      });

      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));

      setEditingTaskId(null);
      setEditData({ title: '', status: '' });
      setError('');
    } catch (err) {
      if (checkAuthError(err)) return;
      console.error('Task update error:', err);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setError('');
    } catch (err) {
      if (checkAuthError(err)) return;
      console.error('Task deletion error:', err);
      setError('Failed to delete task.');
    }
  };

  const formatStatus = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'in progress':
        return '#17a2b8';
      case 'completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'All') return true;
    return task.status === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#f8f9fa',
          margin: 0,
          padding: 0,
        }}
      >
        <h1 style={{ color: '#333' }}>Loading Tasks...</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '20px 5%',
          marginBottom: '30px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <h1
            style={{
              color: '#333',
              margin: 0,
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: '600',
            }}
          >
            📋 Task Dashboard
          </h1>

          {/* Auth-aware buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#218838')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#28a745')
                  }
                >
                  Register
                </button>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#0056b3')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#007bff')
                  }
                >
                  Login
                </button>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = '#c82333')
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = '#dc3545')
                }
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          width: '100%',
          padding: '0 5%',
          boxSizing: 'border-box',
        }}
      >
        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {!isAuthenticated ? (
          // Guest view
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '40px 30px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ marginBottom: '10px', color: '#333' }}>
              Welcome to TaskFlow
            </h2>
            <p style={{ color: '#666' }}>
              Please register or log in using the buttons above to manage your
              tasks.
            </p>
          </div>
        ) : (
          <>
            {/* Filter UI */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'wrap',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <label
                htmlFor="statusFilter"
                style={{
                  fontWeight: '600',
                  fontSize: '15px',
                  color: '#333',
                  whiteSpace: 'nowrap',
                }}
              >
                🔍 Filter By Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#333',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '180px',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span
                style={{
                  marginLeft: 'auto',
                  color: '#666',
                  fontSize: '14px',
                }}
              >
                Showing {filteredTasks.length} of {tasks.length} tasks
              </span>
            </div>

            {/* Create Task Card */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: 'clamp(20px, 3vw, 30px)',
                marginBottom: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h2
                style={{
                  color: '#333',
                  marginTop: 0,
                  marginBottom: '20px',
                  fontSize: 'clamp(18px, 3vw, 20px)',
                  fontWeight: '600',
                }}
              >
                ➕ Create New Task
              </h2>
              <form
                onSubmit={handleCreateTask}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  alignItems: 'end',
                }}
              >
                <div style={{ minWidth: '0' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#555',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newTaskData.title}
                    onChange={onNewTaskChange}
                    placeholder="Enter task title..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      color: '#333',
                      backgroundColor: '#fff',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = '#007bff')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = '#e0e0e0')
                    }
                  />
                </div>

                <div style={{ minWidth: '0' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#555',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={newTaskData.status}
                    onChange={onNewTaskChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      color: '#333',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px 32px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#0056b3')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#007bff')
                  }
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div
              style={{
                marginBottom: '40px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h2
                style={{
                  color: '#333',
                  marginBottom: '20px',
                  fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: '600',
                }}
              >
                📝 Your Tasks{' '}
                <span
                  style={{
                    color: '#666',
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    fontWeight: '400',
                  }}
                >
                  ({filteredTasks.length})
                </span>
              </h2>

              {filteredTasks.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: 'clamp(40px, 8vw, 60px) 30px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <p
                    style={{
                      color: '#999',
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      margin: 0,
                    }}
                  >
                    {statusFilter === 'All'
                      ? 'No tasks yet. Create your first task above! 🚀'
                      : `No tasks found with status "${statusFilter}". Try a different filter! 🔍`}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
                    gap: '16px',
                    width: '100%',
                  }}
                >
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: 'clamp(16px, 3vw, 24px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        borderLeft: `5px solid ${getStatusColor(task.status)}`,
                        minWidth: 0,
                        boxSizing: 'border-box',
                      }}
                    >
                      {editingTaskId === task._id ? (
                        // EDITING MODE
                        <div>
                          <div style={{ marginBottom: '15px' }}>
                            <label
                              style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px',
                                fontWeight: '500',
                              }}
                            >
                              Task Title
                            </label>
                            <input
                              type="text"
                              value={editData.title}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  title: e.target.value,
                                })
                              }
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #007bff',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#333',
                                backgroundColor: '#fff',
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label
                              style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px',
                                fontWeight: '500',
                              }}
                            >
                              Status
                            </label>
                            <select
                              value={editData.status}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  status: e.target.value,
                                })
                              }
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #007bff',
                                borderRadius: '8px',
                                fontSize: '15px',
                                color: '#333',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <button
                              onClick={() => handleUpdateTask(task._id)}
                              style={{
                                flex: '1 1 auto',
                                minWidth: '100px',
                                padding: '10px 24px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#218838')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#28a745')
                              }
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                flex: '1 1 auto',
                                minWidth: '100px',
                                padding: '10px 24px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#5a6268')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#6c757d')
                              }
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // DISPLAY MODE
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              marginBottom: '12px',
                            }}
                          >
                            <h3
                              style={{
                                color: '#333',
                                margin: 0,
                                fontSize: 'clamp(16px, 2.5vw, 18px)',
                                fontWeight: '600',
                                wordBreak: 'break-word',
                              }}
                            >
                              {task.title}
                            </h3>
                            <span
                              style={{
                                backgroundColor: getStatusColor(task.status),
                                color: 'white',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                alignSelf: 'flex-start',
                              }}
                            >
                              {formatStatus(task.status)}
                            </span>
                          </div>

                          <p
                            style={{
                              color: '#999',
                              fontSize: '11px',
                              margin: '0 0 16px 0',
                              fontFamily: 'monospace',
                              wordBreak: 'break-all',
                            }}
                          >
                            ID: {task._id}
                          </p>

                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <button
                              onClick={() => handleEditClick(task)}
                              style={{
                                flex: '1 1 auto',
                                minWidth: '100px',
                                padding: '10px 20px',
                                backgroundColor: '#ffc107',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#e0a800')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#ffc107')
                              }
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              style={{
                                flex: '1 1 auto',
                                minWidth: '100px',
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#c82333')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#dc3545')
                              }
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
