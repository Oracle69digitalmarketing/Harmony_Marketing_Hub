// 🧩 API Gateway Entrypoint
import express from "express";
import campaigns from "./routes/campaigns.js";
import analytics from "./routes/analytics.js";
import automation from "./routes/automation.js";

const app = express();
app.use(express.json());

app.use("/campaigns", campaigns);
app.use("/analytics", analytics);
app.use("/automation", automation);

export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Harmony API Gateway Active" }),
  };
};
