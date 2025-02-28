const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

// Serve the index.html file for the root path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((req, res, next) => {
    if (req.url.endsWith('.usdz')) {
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    }
    next();
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));