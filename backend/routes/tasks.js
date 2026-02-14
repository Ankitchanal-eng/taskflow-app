const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require ('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Route for getting all tasks (READ) and creating a new task (CREATE)
// Both require protection
router.route('/').get(protect, getTasks).post(protect, createTask);

// Routes for updating (UPDATE) and deleting (DELETE) a specific task by ID
// Both require protection
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;