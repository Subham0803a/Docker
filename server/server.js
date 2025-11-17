const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

// 1. GET Request: The home route
app.get('/', (req, res) => {
  console.log('GET / request received');
  res.send('<h1>Hello from the Simple Express Server!</h1><p>Try accessing /api/data or posting JSON to /api/post-test</p>');
});

// 2. GET Request: A simple API endpoint
app.get('/api/data', (req, res) => {
  console.log('GET /api/data request received');
  const serverData = {
    status: 'success',
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
  res.json(serverData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at :- http://localhost:${port}`);
});
