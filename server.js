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
    const { title, description, thumbnailUrl, videoUrl, categories } = req.body;
    const video = new Video({ title, description, thumbnailUrl, videoUrl, categories });

    await video.save();

    res.status(201).json(video);
  } catch (error) {
    console.error('Error saving video to the database:', error);
    res.status(500).json({ error: 'Error saving video to the database.' });
  }
});

// Get all videos with average ratings
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({}, 'title description thumbnailUrl videoUrl categories userRatings');

    // Calculate average rating for each video
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

// Get a specific video with average rating
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    // Calculate average rating for the specific video
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