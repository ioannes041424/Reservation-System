const express = require("express");
require("dotenv").config();
const connectDB = require("./db/connect");
const app = express();
var cors = require("cors");
const authRouter = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use("/api", authRouter);

// Port and Connect to DB
const port = process.env.PORT || 3001;

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGODB_URI);
    
    // If the connection is successful, log it
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
  }
};

start();
