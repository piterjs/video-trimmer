const mongoose = require('mongoose');
const {
  videoSchema,
  serviceSchema,
  buildSchema,
  writeLog
} = require('@piterjs/trimmer-shared');

const watch = require('./watch');
const work = require('./work');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

// eslint-disable-next-line
const Video = mongoose.model('Video', videoSchema);
const Build = mongoose.model('Build', buildSchema);
const Service = mongoose.model('Service', serviceSchema);

const sr = async () => {
  try {
    const service = await Service.findOne({ service: 'youtube' }).exec();
    if (!service) {
      setTimeout(() => sr(), 3000);
    } else {
      const svc = service.toJSON();
      if (process.env.BUILD_ID) {
        const build = await Build.findOne({ _id: process.env.BUILD_ID })
          .populate('video')
          .exec();
        if (!build) {
          await writeLog(process.env.BUILD_ID, 'error', `build: ${process.env.BUILD_ID} not found`);
          process.exit(1);
        }
        await work(build, svc);
      } else {
        watch(Build, svc);
      }
    }
  } catch (err) {
    console.log(err);
    setTimeout(() => sr(), 3000);
  }
};

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongodb connected');
  setTimeout(() => {
    sr();
  }, Math.round(5 + Math.random() * (10 - 5)))
});
