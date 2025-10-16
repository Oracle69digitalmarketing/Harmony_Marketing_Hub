import express from "express";
const router = express.Router();

router.post("/trigger", (req, res) => {
  res.json({ automation: "Automation trigger received" });
});

export default router;
