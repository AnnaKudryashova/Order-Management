const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Serve static files from the dist directory
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 