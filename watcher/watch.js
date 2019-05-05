const { execSync } = require('child_process');

const { writeLog } = require('@piterjs/trimmer-shared');

const download = require('./downloader');
const upload = require('./upload');

const { trimVideo, concatVideo } = require('./ffmpeg');

const watch = async (Build, Service) => {
  Service.findOne({ service: 'youtube' }, (err, svc) => {
    if (err) {
      console.error(err);
      setTimeout(() => watch(Build, Service), 3000);
      return;
    }
    if (!svc) {
      setTimeout(() => watch(Build, Service), 3000);
      return;
    }
    svc = svc.toJSON();
    Build.findOne({ status: 'init' })
      .populate('video')
      .exec(async (err, build) => {
        if (err) {
          console.error(err);
          setTimeout(() => watch(Build, Service), 3000);
          return;
        }
        if (!build) {
          setTimeout(() => watch(Build, Service), 3000);
          return;
        }
        try {
          build.status = 'starting';
          build = await build.save();
          const { video } = build;
          await writeLog(build._id, 'download-stream', 'start downloading stream');
          build.status = 'download: stream';
          build = await build.save();
          await download(build._id, 'download-stream', video.original, 'orig.mp4');
          await writeLog(build._id, 'download-stream', 'stream was downloaded');

          await writeLog(build._id, 'download-preroll', 'start downloading preroll');
          build.status = 'download: postroll';
          build = await build.save();
          await download(build._id, 'download-preroll', video.postroll, 'postroll.mp4');
          await writeLog(build._id, 'download-preroll', 'preroll was downloaded');

          for (let i = 0; i < video.video.length; i += 1) {
            await writeLog(build._id, `download-preroll-${i}`, `download ${i} preroll`);
            build.status = `download: ${i} preroll`;
            build = await build.save();
            await download(build._id, `download-preroll-${i}`, video.video[i].preroll, `${i}-preroll.mp4`);
            await writeLog(build._id, `download-preroll-${i}`, `${i} preroll was downloaded`);
            await writeLog(build._id, `trim-${i}`, `start trimming video #${i}`);
            build.status = `trim: ${i}`;
            build = await build.save();
            if (video.get('scale')) {
              await trimVideo(
                build._id,
                `trim-${i}`,
                'orig.mp4',
                `${i}-trim.mp4`,
                video.video[i].start,
                video.video[i].end,
                ['-vf', `scale=${video.get('scale')}`]
              );
            } else {
              await trimVideo(build._id, `trim-${i}`, 'orig.mp4', `${i}-trim.mp4`, video.video[i].start, video.video[i].end);
            }
            await writeLog(build._id, `trim-${i}`, `video #${i} was trimmed`);
            await writeLog(build._id, `concat-${i}`, `start concating video #${i}`);
            build.status = `concat: ${i}`;
            build = await build.save();
            await concatVideo(
              build._id, `concat-${i}`,
              `${i}-preroll.mp4`, `${i}-trim.mp4`, 'postroll.mp4',
              `${i}-video.mp4`,
              video.video[i].start, video.video[i].end
            );
            await writeLog(build._id, `concat-${i}`, `build #${i} was concat`);
            await writeLog(build._id, `concat-${i}`, `remove trims & prerolls for build ${i}`);
            execSync(`rm -rf ${i}-trim.mp4 ${i}-preroll.mp4`);
            await writeLog(build._id, `upload-${i}`, `start uploading build ${i}`);
            build.status = `upload: ${i}`;
            build = await build.save();
            await upload(build._id, `upload-${i}`, svc.token, video.video[i], `${i}-video.mp4`);
            await writeLog(build._id, `upload-${i}`, `video ${i} was uploaded`);
            await writeLog(build._id, `upload-${i}`, `------- video ${i} was ready ------- `);
            execSync(`rm -rf ${i}-video.mp4`);
          }
          await writeLog(build._id, 'end', `build ${build._id} was finished`);
          build.status = 'finished';
          build = await build.save();
          execSync('rm -rf *.mp4');
          setTimeout(() => watch(Build, Service), 3000);
        } catch (err) {
          await writeLog(build._id, 'error', `error: ${err}`);
          console.error('Error', err);
          build.status = 'error';
          await build.save();
          try {
            execSync('rm -rf *.mp4');
          } catch (err) {
            console.error(err);
          }
          setTimeout(() => watch(Build, Service), 3000);
        }
      });
  });
};

module.exports = watch;
