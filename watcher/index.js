const mongoose = require('mongoose');
const { videoSchema, serviceSchema } = require('@piterjs/trimmer-shared');

const watch = require('./watch');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

const Video = mongoose.model('Video', videoSchema);
const Service = mongoose.model('Service', serviceSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongodb connected');
  watch(Video, Service);
});
