const mongoose = require('mongoose');
const { videoSchema, serviceSchema, buildSchema } = require('@piterjs/trimmer-shared');

const watch = require('./watch');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

// eslint-disable-next-line
const Video = mongoose.model('Video', videoSchema);
const Build = mongoose.model('Build', buildSchema);
const Service = mongoose.model('Service', serviceSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongodb connected');
  watch(Build, Service);
});
