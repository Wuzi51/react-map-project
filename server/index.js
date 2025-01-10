import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url'
import axios from 'axios'
dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const publicPath = path.join(__dirname, '../dist')
app.get("/api/places", async (req, res) => {
  const { lat, lng, radius, type } = req.query;
  const apiKey = process.env.VITE_APP_GOOGLE_PLACE_API_KEY;
  if (!lat || !lng || !radius || !type || !apiKey) {
    return res.status(400).json({ error: "缺少必要的查詢參數或 API 金鑰" });
  }
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Google Places API 請求錯誤:", error.message);
    res.status(500).json({ error: "請求失敗，請稍後再試" });
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});