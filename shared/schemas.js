const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const titleSchema = new Schema({
  preroll: String,
  start: String,
  end: String,
  title: String,
  description: String,
  tags: String
});

const videoSchema = new Schema({
  title: String,
  original: String,
  scale: String,
  postroll: String,
  video: [titleSchema],
  builds: [{ type: Schema.Types.ObjectId, ref: 'Build' }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
videoSchema.pre('save', function (next) {
  this.updated = new Date();
  next();
});

const tokenSchema = new Schema({
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: String
})

const serviceSchema = new Schema({
  service: String,
  token: tokenSchema
});

const buildSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video' },
  status: { type: String, default: 'init' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
buildSchema.pre('save', function (next) {
  this.updated = new Date();
  next();
});

module.exports = {
  titleSchema,
  videoSchema,
  serviceSchema,
  tokenSchema,
  buildSchema
};
