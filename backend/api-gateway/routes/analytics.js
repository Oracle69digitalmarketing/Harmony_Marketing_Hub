import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ analytics: "Real-time campaign analytics" });
});

export default router;
