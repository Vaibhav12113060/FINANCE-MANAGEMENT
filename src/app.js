import express from "express";
import cors from "cors";
import morgan from "morgan";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test Route
app.get("/", (req, res) => {
  res.status(200).send(" Finance Backend Running");
});
