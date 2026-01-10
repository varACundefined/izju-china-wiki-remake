const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 7000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
