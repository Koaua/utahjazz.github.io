const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

const API_KEY = 'AIzaSyBInbdVB09Yv4ddYykXDAo3ppHeFKaoI4U';  // Replace with your YouTube API key

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/channel/:channelId', async (req, res) => {
  const { channelId } = req.params;

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
      params: {
        part: 'snippet,statistics',
        id: channelId,
        key: API_KEY,
      },
    });

    const channelData = response.data.items[0];

    if (!channelData) {
      return res.status(404).send('Channel not found');
    }

    const monetizationStatus = channelData.monetizationDetails
      ? 'Monetized'
      : 'Not Monetized';

    res.json({
      title: channelData.snippet.title,
      description: channelData.snippet.description,
      subscribers: channelData.statistics.subscriberCount,
      views: channelData.statistics.viewCount,
      monetizationStatus: monetizationStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
