const work = require('./work');

const watch = async (Build, svc) => {
  try {
    const build = await Build.findOne({ status: 'init' }).populate('video').exec();
    if (!build) {
      setTimeout(() => watch(Build, svc), 3000);
      return;
    }
    await work(build, svc);
    setTimeout(() => watch(Build, svc), 3000);
  } catch (err) {
    console.log(err);
    setTimeout(() => watch(Build, svc), 3000);
  }
};

module.exports = watch;
