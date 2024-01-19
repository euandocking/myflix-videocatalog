const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  // Add other fields as needed
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;