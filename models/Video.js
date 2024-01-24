const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming there is a User model
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: { type: String, required: true },
  categories: [String],
  userRatings: [ratingSchema] // Array of user ratings
});

videoSchema.virtual('averageRating').get(function () {
  const totalRatings = this.userRatings.reduce((sum, rating) => sum + rating.rating, 0);
  const numberOfRatings = this.userRatings.length;
  return numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
