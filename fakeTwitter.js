// fakeTwitter.js
//this is the database layer of the project.


require('dotenv').config(); // loads .env file
const mongoose = require('mongoose');

// ------------------
//  Connect to Mongo
// ------------------
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'fake_twitter';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

// ------------------
//  Define Schemas
// ------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    displayName: String,
    bio: String,
  },
  { timestamps: true }
);

const tweetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ------------------
//  Define Models
// ------------------
const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

// ------------------
//  Functions
// ------------------
async function createUser(username, displayName, bio = '') {
  await connectDB();
  const user = new User({ username, displayName, bio });
  await user.save();
  console.log(`✅ User created: ${username}`);
  return user;
}

async function postTweet(username, content) {
  await connectDB();
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error(`User "${username}" not found`);
  }
  const tweet = new Tweet({ userId: user._id, content });
  await tweet.save();
  console.log(`📝 Tweet posted by ${username}: ${content}`);
  return tweet;
}

async function getTweetsByUser(username) {
  await connectDB();
  const user = await User.findOne({ username });
  if (!user) return [];
  const tweets = await Tweet.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();
  console.log(`📜 Found ${tweets.length} tweets for ${username}`);
  return tweets;
}

// Export functions so you can call them from other scripts
module.exports = { createUser, postTweet, getTweetsByUser };
