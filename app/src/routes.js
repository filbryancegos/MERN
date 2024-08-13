const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const JWT_SECRET = 'eking_brutos';

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Register
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const errors = {};

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, errors: {
            "username": "Please enter and username",
            "email": "Please enter and email",
            "password": "Please enter and password eking"
        } });
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    for (const [key, value] of Object.entries(req.body)) {
        console.log(key, value);
        if (value === '') {
            errors[key] = `Please enter and ${key}`
        }
    }


    if (!isEmpty(errors)) {
        return res.status(400).json({ success: false, errors });
    }

    // if (!username || !email || !password) {
    //     return res.status(400).json({ success: false, message: 'Please enter all fields' });
    // }

    // Email validation function
    const isValidEmail = (email) => {
        // Basic regex pattern for validating email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;
                db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (err, results) => {
                    if (err) throw err;
                    res.json({ success: true, user: {username, email, hash}, message: 'User registered successfully' });
                });
            });
        }
    });
});

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const errors = {};

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, errors: {
            "username": "Please enter username",
            "password": "Please enter password"
        } });
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    for (const [key, value] of Object.entries(req.body)) {
        if (value === '') {
            errors[key] = `Please enter ${key}`
        }
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ success: false, errors });
    }


    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(401).send({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const user = results[0];
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
            res.json({ 
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                message: 'User logged in successfully' 
             });
        } else {
            res.status(401).send({
                success: false,
                message: 'Invalid username or password'
            });
        }
    });
});

// Define the route to get all users
router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Define the route to get a single user by ID
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(result[0]);
    });
});


// Define the route to delete a user by ID
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    });
});

// Define the route to reset a user's password
router.put('/users/:id/reset-password', (req, res) => {
    const userId = req.params.id;
    const newPassword = req.body.password;
    
    if (!newPassword) {
        return res.status(400).send('Password is required');
    }
    
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(sql, [newPassword, userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.send('Password reset successfully');
    });
});


// Define protected route to create or update tasks
router.post('/tasks', authenticateToken, (req, res) => {
    const { task, complete } = req.body;
    const userId = req.user.id; // Extracted from JWT token

    // Example SQL to insert or update tasks for the authenticated user
    const sql = 'INSERT INTO tasks (user_id, task, complete) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE task = ?, complete = ?';
    db.query(sql, [userId, task, complete, task, complete], (err, result) => {
        console.log(task, complete);
        if (err) {
            return res.status(500).send(err);
        }
        const newTaskId = result.insertId;
        db.query('SELECT * FROM tasks WHERE id = ?', [newTaskId], (err, tasks) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ 
                success: true, 
                task: tasks[0],
                message: 'Task created successfully' 
             });
        });
        //res.send('Task created/updated successfully');
    });
});

// Get tasks endpoint
router.get('/tasks', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
       
    });
});


// Update task endpoint
router.put('/tasks/:id', authenticateToken, (req, res) => {
    const { complete, task } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    // Check if task or complete is provided for update
    if (task === undefined && complete === undefined) {
        return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    // Construct the SQL query dynamically based on provided fields
    let fields = [];
    let values = [];

    if (task !== undefined) {
        fields.push('task = ?');
        values.push(task);
    }

    if (complete !== undefined) {
        fields.push('complete = ?');
        values.push(complete);
    }

    values.push(id, userId);

    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Retrieve the updated task to include in the response
        db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, tasks) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }
            res.json({
                success: true,
                task: tasks[0],
                message: 'Task updated successfully'
            });
        });
    });
});

// Delete task endpoint
router.delete('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send(
                { success: false, message: 'Task not found'}
            );
        }
        res.json({ success: true, message: 'Task deleted successfully', taskId: id });
        //res.send('Task deleted successfully');
    });
});

// Complete task endpoint
router.put('/tasks/:id/complete', authenticateToken, (req, res) => {
    const { id } = req.params; // Task ID from URL parameters
    const userId = req.user.id; // User ID from authenticated user

    console.log('Complete Task Request:', { id, userId });

    // Query to check if the task is already complete
    const checkSql = 'SELECT complete FROM tasks WHERE id = ? AND user_id = ?';
    
    db.query(checkSql, [id, userId], (err, tasks) => {
        if (err) {
            console.error('Error checking task status:', err);
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        // Check if the task was found
        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check if the task is already complete
        if (tasks[0].complete) {
            return res.json({
                success: false,
                message: 'Task is already marked as complete',
                task: tasks[0] // Return the current state of the task
            });
        }

        // SQL query to update the task's complete status
        const updateSql = 'UPDATE tasks SET complete = ? WHERE id = ? AND user_id = ?';

        // Execute the query with complete status set to true
        db.query(updateSql, [true, id, userId], (err, result) => {
            if (err) {
                console.error('Error updating task status:', err);
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }

            console.log('Complete Task Update Result:', result);

            // Retrieve the updated task to include in the response
            db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, updatedTasks) => {
                if (err) {
                    console.error('Error retrieving updated task:', err);
                    return res.status(500).json({ success: false, message: 'Database error', error: err });
                }

                console.log('Retrieved Completed Task:', updatedTasks);

                if (updatedTasks.length === 0) {
                    return res.status(404).json({ success: false, message: 'Task not found after update' });
                }

                res.json({
                    success: true,
                    task: updatedTasks[0],
                    message: 'Task marked as complete successfully'
                });
            });
        });
    });
});


module.exports = router;