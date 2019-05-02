const { execSync } = require('child_process');

const { writeLog } = require('@piterjs/trimmer-shared');

const download = require('./downloader');
const upload = require('./upload');

const { trimVideo, concatVideo } = require('./ffmpeg');

const watch = async (Video, Service) => {
  Service.findOne({ service: 'youtube' }, (err, svc) => {
    if (err) {
      console.error(err);
      setTimeout(() => watch(Video, Service), 3000);
      return;
    }
    if (!svc) {
      setTimeout(() => watch(Video, Service), 3000);
      return;
    }
    Video.findOne({ status: 'init' })
      .exec(async (err, video) => {
        if (err) {
          console.error(err);
          setTimeout(() => watch(Video, Service), 3000);
          return;
        }
        if (!video) {
          setTimeout(() => watch(Video, Service), 3000);
          return;
        }
        try {
          await writeLog(video._id, 'download-stream', 'start downloading stream');
          video.status = 'download: stream';
          video = await video.save();
          await download(video._id, 'download-stream', video.original, 'orig.mp4');
          await writeLog(video._id, 'download-stream', 'stream was downloaded');

          await writeLog(video._id, 'download-preroll', 'start downloading preroll');
          video.status = 'download: postroll';
          video = await video.save();
          await download(video._id, 'download-preroll', video.postroll, 'postroll.mp4');
          await writeLog(video._id, 'download-preroll', 'preroll was downloaded');

          for (let i = 0; i < video.video.length; i += 1) {
            await writeLog(video._id, `download-preroll-${i}`, `download ${i} preroll`);
            video.status = `download: ${i} preroll`;
            video = await video.save();
            await download(video._id, `download-preroll-${i}`, video.video[i].preroll, `${i}-preroll.mp4`);
            await writeLog(video._id, `download-preroll-${i}`, `${i} preroll was downloaded`);
            await writeLog(video._id, `trim-${i}`, `start trimming video #${i}`);
            video.status = `trimming: ${i}`;
            video = await video.save();
            await trimVideo(video._id, `trim-${i}`, 'orig.mp4', `${i}-trim.mp4`, video.video[i].start, video.video[i].end);
            await writeLog(video._id, `trim-${i}`, `video #${i} was trimmed`);
            await writeLog(video._id, `concat-${i}`, `start concating video #${i}`);
            video.status = `concat: ${i}`;
            video = await video.save();
            await concatVideo(video._id, `concat-${i}`, `${i}-preroll.mp4`, `${i}-trim.mp4`, 'postroll.mp4', `${i}-video.mp4`, video.video[i].start, video.video[i].end);
            await writeLog(video._id, `concat-${i}`, `video #${i} was concat`);
            await writeLog(video._id, `concat-${i}`, `remove trims & prerolls for video ${i}`);
            execSync(`rm -rf ${i}-trim.mp4 ${i}-preroll.mp4`);
            await writeLog(video._id, `upload-${i}`, `start uploading video ${i}`);
            video.status = `upload: ${i}`;
            video = await video.save();
            const file = `${i}-video.mp4`;
            await upload(video._id, `upload-${i}`, svc.token, video.video[i], file);
            await writeLog(video._id, `upload-${i}`, `video ${i} was uploaded`);
            await writeLog(video._id, `upload-${i}`, `------- video ${i} was ready ------- `);
            execSync(`rm -rf ${file}`);
          }
          await writeLog(video._id, 'end', 'worker was finished');
          video.status = 'finished';
          video = await video.save();
          execSync('rm -rf *.mp4');
          setTimeout(() => watch(Video, Service), 3000);
        } catch (err) {
          await writeLog(video._id, 'error', `error: ${err}`);
          video.status = 'finished';
          console.error('Error', err);
          video.status = 'error';
          await video.save();
          try {
            execSync('rm -rf *.mp4');
          } catch (err) {
            console.error(err);
          }
        }
      });
  });
};

module.exports = watch;
