const express = require('express');
const stripe = require('stripe')('sk_test_51JprSpH6YrdtkYECuPCY9zC2NFGRYuEBZLes9paj0cRrjSoMTAi1nX3lBYgzsaH7kxeT8KAFZUE3EG18CdJPE4Xq00gC0QbE7Y');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the index.html file for the root path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use the PORT environment variable provided by Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));