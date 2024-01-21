const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String, // New field for thumbnail URL
  videoUrl: { type: String, required: true }, // New field for video URL, marked as required
  category: String,
  // Add other fields as needed
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
