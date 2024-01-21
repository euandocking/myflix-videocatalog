const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: { type: String, required: true },
  categories: [String], // Change the type to an array of strings
  // Add other fields as needed
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
