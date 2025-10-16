import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ campaigns: "Fetch campaigns" });
});

router.post("/launch", (req, res) => {
  res.json({ status: "Campaign launched" });
});

export default router;
