// const express = require('express');
// const path = require('path');
// require('dotenv').config();

// // Import database connection and User model
// const db = require('./db/db.js');
// const User = require('./model/user-model.js');

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'src', 'web')));

// // ============= ROUTES =============

// // 1. GET: Home route
// app.get('/', (req, res) => {
//   console.log('GET / request received');
//   res.send(`
//     <h1>Hello from the Simple Express Server!</h1>
//     <p>Available routes:</p>
//     <ul>
//       <li><a href="/data">GET /data</a> - Get server info</li>
//       <li><a href="/users">GET /users</a> - Get all users</li>
//       <li><a href="/frontend">GET /frontend</a> - User Registration Form</li>
//     </ul>
//   `);
// });

// // 2. GET: Server data endpoint
// app.get('/data', (req, res) => {
//   console.log('GET /data request received');
//   const serverData = {
//     status: 'success',
//     message: 'Data retrieved successfully',
//     timestamp: new Date().toISOString(),
//     version: '2.3',
//     environment: process.env.NODE_ENV || 'development'
//   };
//   res.json(serverData);
// });

// // 3. GET: Frontend form
// // ✅ FIXED: Correct path to HTML file
// app.get('/frontend', (req, res) => {
//   console.log('GET /frontend request received');
//   res.sendFile(path.join(__dirname, 'src', 'web', 'index.html'));
// });

// // ============= CRUD OPERATIONS =============

// // CREATE - POST: Add new user
// app.post('/users', async (req, res) => {
//   console.log('POST /users request received');
//   console.log('Request body:', req.body);

//   try {
//     const { name, gmail, password } = req.body;

//     // Validation
//     if (!name || !gmail || !password) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Please provide name, gmail, and password'
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ gmail });
//     if (existingUser) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'User with this email already exists'
//       });
//     }

//     // Create new user
//     const newUser = new User({
//       name,
//       gmail,
//       password
//     });

//     await newUser.save();

//     res.status(201).json({
//       status: 'success',
//       message: 'User created successfully',
//       data: {
//         id: newUser._id,
//         name: newUser.name,
//         gmail: newUser.gmail,
//         createdAt: newUser.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Error creating user',
//       error: error.message
//     });
//   }
// });

// // READ - GET: Get all users
// app.get('/users', async (req, res) => {
//   console.log('GET /users request received');

//   try {
//     const users = await User.find().select('-password').sort({ createdAt: -1 });
    
//     res.json({
//       status: 'success',
//       count: users.length,
//       data: users
//     });

//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Error fetching users',
//       error: error.message
//     });
//   }
// });

// // READ - GET: Get single user by ID
// app.get('/users/:id', async (req, res) => {
//   console.log('GET /users/:id request received');

//   try {
//     const user = await User.findById(req.params.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'User not found'
//       });
//     }

//     res.json({
//       status: 'success',
//       data: user
//     });

//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Error fetching user',
//       error: error.message
//     });
//   }
// });

// // UPDATE - PUT: Update user by ID
// app.put('/users/:id', async (req, res) => {
//   console.log('PUT /users/:id request received');

//   try {
//     const { name, gmail, password } = req.body;
//     const updateData = {};

//     if (name) updateData.name = name;
//     if (gmail) updateData.gmail = gmail;
//     if (password) updateData.password = password;

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedUser) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'User not found'
//       });
//     }

//     res.json({
//       status: 'success',
//       message: 'User updated successfully',
//       data: updatedUser
//     });

//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Error updating user',
//       error: error.message
//     });
//   }
// });

// // DELETE - DELETE: Delete user by ID
// app.delete('/users/:id', async (req, res) => {
//   console.log('DELETE /users/:id request received');

//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);

//     if (!deletedUser) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'User not found'
//       });
//     }

//     res.json({
//       status: 'success',
//       message: 'User deleted successfully',
//       data: {
//         id: deletedUser._id,
//         name: deletedUser.name
//       }
//     });

//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Error deleting user',
//       error: error.message
//     });
//   }
// });

// // ============= ERROR HANDLING =============

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: 'Route not found'
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     status: 'error',
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // ============= START SERVER =============

// app.listen(port, () => {
//   console.log(`🚀 Server is running at: http://localhost:${port}`);
//   console.log(`📄 Frontend form: http://localhost:${port}/frontend`);
//   console.log(`👥 View users: http://localhost:${port}/users`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
// });

//==============================================={TESTING}======================================================

const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

//GET all users
app.get("/getUsers", async (req, res) => {
    await client.connect(URL);
    console.log('Connected successfully to server');

    const db = client.db("Testing-db");
    const data = await db.collection('users').find({}).toArray();
    
    client.close();
    res.send(data);
});

//POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    console.log(req.body);
    await client.connect(URL);
    console.log('Connected successfully to server');

    const db = client.db("Testing-db");
    const data = await db.collection('users').insertOne(userObj);
    console.log(data);
    console.log("data inserted in DB");
    client.close();
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
});