import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ "message": "Hello" });
});

// TODO: Add your API routes here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
