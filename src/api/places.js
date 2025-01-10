import axios from 'axios';

export default async function handler(req, res) {
  const { lat, lng, radius, type } = req.query;
  const apiKey = process.env.VITE_APP_GOOGLE_PLACE_API_KEY;

  if (!lat || !lng || !radius || !type || !apiKey) {
    return res.status(400).json({ error: "缺少必要的查詢參數或 API 金鑰" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Google Places API 請求錯誤:", error.message);
    res.status(500).json({ error: "請求失敗，請稍後再試" });
  }
}
