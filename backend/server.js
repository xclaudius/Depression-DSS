const app = require("./app");
const mlService = require('./services/mlService');
const PORT = process.env.PORT || 5000;
// server.js or app.js

// Load ML models on server start
mlService.loadModels();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});