const app = require("./src/app");
const connectDB = require("./src/config/db");

const port = 4000;

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
