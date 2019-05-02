const mongoose = require('mongoose');

const { influx, writeLog } = require('./influx');

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
  original: String,
  postroll: String,
  video: [titleSchema],
  status: { type: String, default: 'init' },
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

module.exports = {
  videoSchema,
  titleSchema,
  serviceSchema,
  tokenSchema,
  influx,
  writeLog
};
