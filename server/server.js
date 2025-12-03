
// const express = require("express");
// const path = require("path");
// const { MongoClient } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // MongoDB Configuration
// const MONGO_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
// const DB_NAME = "Testing-db";

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "src", "web")));

// // MongoDB Client
// const client = new MongoClient(MONGO_URL);

// // ============= ROUTES =============

// // Home route
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>Hello from Express Server!</h1>
//     <p>Available routes:</p>
//     <ul>
//       <li><a href="/data">GET /data</a> - Server info</li>
//       <li><a href="/users">GET /users</a> - Get all users</li>
//       <li><a href="/frontend">GET /frontend</a> - Registration Form</li>
//     </ul>
//   `);
// });

// // Server data endpoint
// app.get("/data", (req, res) => {
//   const serverData = {
//     status: "success",
//     message: "Data retrieved successfully",
//     timestamp: new Date().toISOString(),
//     version: "2.3"
//   };
//   res.json(serverData);
// });

// // Frontend form
// app.get("/frontend", (req, res) => {
//   res.sendFile(path.join(__dirname, "src", "web", "index.html"));
// });

// // ============= CRUD OPERATIONS =============

// // CREATE - POST: Add new user
// app.post("/users", async (req, res) => {
//   console.log("POST /users request received");
//   console.log("Request body:", req.body);

//   try {
//     const { name, gmail, password } = req.body;

//     // Validation
//     if (!name || !gmail || !password) {
//       return res.status(400).json({
//         status: "error",
//         message: "Please provide name, gmail, and password"
//       });
//     }

//     // Connect to MongoDB
//     await client.connect();
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection("users");

//     // Check if user already exists
//     const existingUser = await usersCollection.findOne({ gmail });
//     if (existingUser) {
//       await client.close();
//       return res.status(400).json({
//         status: "error",
//         message: "User with this email already exists"
//       });
//     }

//     // Create user object
//     const newUser = {
//       name,
//       gmail: gmail.toLowerCase(),
//       password,
//       createdAt: new Date()
//     };

//     // Insert user
//     const result = await usersCollection.insertOne(newUser);
//     console.log("User inserted:", result.insertedId);

//     await client.close();

//     res.status(201).json({
//       status: "success",
//       message: "User created successfully",
//       data: {
//         id: result.insertedId,
//         name: newUser.name,
//         gmail: newUser.gmail,
//         createdAt: newUser.createdAt
//       }
//     });

//   } catch (error) {
//     console.error("Error creating user:", error);
//     await client.close();
//     res.status(500).json({
//       status: "error",
//       message: "Error creating user",
//       error: error.message
//     });
//   }
// });

// // READ - GET: Get all users
// app.get("/users", async (req, res) => {
//   console.log("GET /users request received");

//   try {
//     await client.connect();
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection("users");

//     // Get all users (excluding password)
//     const users = await usersCollection
//       .find({})
//       .project({ password: 0 })  // Exclude password field
//       .sort({ createdAt: -1 })   // Sort by newest first
//       .toArray();

//     await client.close();

//     res.json({
//       status: "success",
//       count: users.length,
//       data: users
//     });

//   } catch (error) {
//     console.error("Error fetching users:", error);
//     await client.close();
//     res.status(500).json({
//       status: "error",
//       message: "Error fetching users",
//       error: error.message
//     });
//   }
// });

// // READ - GET: Get single user by ID
// app.get("/users/:id", async (req, res) => {
//   console.log("GET /users/:id request received");

//   try {
//     const { ObjectId } = require("mongodb");
//     const userId = req.params.id;

//     // Validate ObjectId
//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid user ID"
//       });
//     }

//     await client.connect();
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection("users");

//     const user = await usersCollection.findOne(
//       { _id: new ObjectId(userId) },
//       { projection: { password: 0 } }  // Exclude password
//     );

//     await client.close();

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found"
//       });
//     }

//     res.json({
//       status: "success",
//       data: user
//     });

//   } catch (error) {
//     console.error("Error fetching user:", error);
//     await client.close();
//     res.status(500).json({
//       status: "error",
//       message: "Error fetching user",
//       error: error.message
//     });
//   }
// });

// // UPDATE - PUT: Update user by ID
// app.put("/users/:id", async (req, res) => {
//   console.log("PUT /users/:id request received");

//   try {
//     const { ObjectId } = require("mongodb");
//     const userId = req.params.id;
//     const { name, gmail, password } = req.body;

//     // Validate ObjectId
//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid user ID"
//       });
//     }

//     // Build update object
//     const updateData = {};
//     if (name) updateData.name = name;
//     if (gmail) updateData.gmail = gmail.toLowerCase();
//     if (password) updateData.password = password;
//     updateData.updatedAt = new Date();

//     await client.connect();
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection("users");

//     const result = await usersCollection.findOneAndUpdate(
//       { _id: new ObjectId(userId) },
//       { $set: updateData },
//       { returnDocument: "after", projection: { password: 0 } }
//     );

//     await client.close();

//     if (!result.value) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found"
//       });
//     }

//     res.json({
//       status: "success",
//       message: "User updated successfully",
//       data: result.value
//     });

//   } catch (error) {
//     console.error("Error updating user:", error);
//     await client.close();
//     res.status(500).json({
//       status: "error",
//       message: "Error updating user",
//       error: error.message
//     });
//   }
// });

// // DELETE - DELETE: Delete user by ID
// app.delete("/users/:id", async (req, res) => {
//   console.log("DELETE /users/:id request received");

//   try {
//     const { ObjectId } = require("mongodb");
//     const userId = req.params.id;

//     // Validate ObjectId
//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid user ID"
//       });
//     }

//     await client.connect();
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection("users");

//     const result = await usersCollection.findOneAndDelete(
//       { _id: new ObjectId(userId) }
//     );

//     await client.close();

//     if (!result.value) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found"
//       });
//     }

//     res.json({
//       status: "success",
//       message: "User deleted successfully",
//       data: {
//         id: result.value._id,
//         name: result.value.name
//       }
//     });

//   } catch (error) {
//     console.error("Error deleting user:", error);
//     await client.close();
//     res.status(500).json({
//       status: "error",
//       message: "Error deleting user",
//       error: error.message
//     });
//   }
// });

// // ============= ERROR HANDLING =============

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     status: "error",
//     message: "Route not found"
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error"
//   });
// });

// // ============= START SERVER =============

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on: http://localhost:${PORT}`);
//   console.log(`📄 Frontend form: http://localhost:${PORT}/frontend`);
//   console.log(`👥 View users: http://localhost:${PORT}/users`);
//   console.log(`🗄️  Database: ${DB_NAME}`);
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