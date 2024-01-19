const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Video = require('./models/Video');

const app = express();
const PORT = process.env.PORT || 5001;

// Use the environment variable for MongoDB URI
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

// Create a new video
app.post('/api/videos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const video = new Video({ title, description });

    await video.save();

    res.status(201).json(video);
  } catch (error) {
    console.error('Error saving video to the database:', error);
    res.status(500).json({ error: 'Error saving video to the database.' });
  }
});

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error('Error retrieving videos from the database:', error);
    res.status(500).json({ error: 'Error retrieving videos from the database.' });
  }
});

// Add more routes for updating and deleting videos as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});