const mongoose = require('mongoose');

const { videoSchema, serviceSchema, buildSchema, hubSchema } = require('@piterjs/trimmer-shared');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

const Video = mongoose.model('Video', videoSchema);
const Build = mongoose.model('Build', buildSchema);
const Service = mongoose.model('Service', serviceSchema);
const Hub = mongoose.model('Hub', hubSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongodb connected');
});

module.exports = {
  Video,
  Build,
  Service,
  Hub
};
