const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const Video = require('./models/Video');

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.json());

// JWT validation middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check for the video_access role in the user roles
    if (!user.roles || !user.roles.includes('video_access')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    req.user = user; // Make the user information available for further request handling
    next();
  });
};


// Apply authentication middleware to all routes under /api
app.use('/api', authenticateJWT);

// Create a new video (authenticated users only)
app.post('/api/videos', async (req, res) => {
  // Access user information using req.user
  const { title, description, thumbnailUrl, videoUrl, categories } = req.body;
  const video = new Video({ title, description, thumbnailUrl, videoUrl, categories });

  try {
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error('Error saving video to the database:', error);
    res.status(500).json({ error: 'Error saving video to the database.' });
  }
});

// Get all videos with average ratings (authenticated users only)
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({}, 'title description thumbnailUrl videoUrl categories userRatings');
    const videosWithAverageRating = videos.map((video) => {
      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        categories: video.categories,
        averageRating: video.averageRating,
      };
    });
    res.json(videosWithAverageRating);
  } catch (error) {
    console.error('Error retrieving videos from the database:', error);
    res.status(500).json({ error: 'Error retrieving videos from the database.' });
  }
});

// Get a specific video with average rating (authenticated users only)
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const videoWithAverageRating = {
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      categories: video.categories,
      averageRating: video.averageRating,
    };
    res.json(videoWithAverageRating);
  } catch (error) {
    console.error(`Error retrieving video with ID ${req.params.id} from the database:`, error);
    res.status(500).json({ error: 'Error retrieving video from the database.' });
  }
});

// Add more routes for updating and deleting videos as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
