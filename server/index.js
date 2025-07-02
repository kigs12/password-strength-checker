const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/evaluate', (req, res) => {
  const { password } = req.body;
  console.log(`Received password: ${password}`);
  res.json({ message: 'Password received by server' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
