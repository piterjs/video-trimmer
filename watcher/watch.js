const { execSync } = require('child_process');

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
          video.status = 'download: stream';
          video = await video.save();
          await download(video.original, 'orig.mp4');
          console.log('original was downloaded');

          video.status = 'download: postroll';
          video = await video.save();
          await download(video.postroll, 'postroll.mp4');
          console.log('postroll was downloaded');

          for (let i = 0; i < video.video.length; i += 1) {
            console.log(`download ${i} preroll`);
            video.status = `download: ${i} preroll`;
            video = await video.save();
            await download(video.video[i].preroll, `${i}-preroll.mp4`);
            console.log(`${i} preroll was downloaded`);
          }
          console.log('prerolls was downloaded');

          for (let i = 0; i < video.video.length; i += 1) {
            console.log(`trim ${i}: video`);
            video.status = `trimming ${i}`;
            video = await video.save();
            await trimVideo('orig.mp4', `${i}-trim.mp4`, video.video[i].start, video.video[i].end);
            console.log(`${i} video was trimmed`);
          }
          console.log('videos was trimmed');

          for (let i = 0; i < video.video.length; i += 1) {
            console.log(`concat ${i} video`);
            video.status = `concat: ${i}`;
            video = await video.save();
            await concatVideo(`${i}-preroll.mp4`, `${i}-trim.mp4`, 'postroll.mp4', `${i}-video.mp4`, video.video[i].start, video.video[i].end);
            console.log(`${i} video was concated`);
          }
          console.log('end concating videos');
          console.log('remove trims & prerolls');
          for (let i = 0; i < video.video.length; i += 1) {
            execSync(`rm -rf ${i}-trim.mp4 ${i}-preroll.mp4`);
          }
          for (let i = 0; i < video.video.length; i += 1) {
            console.log(`upload video ${i}`);
            video.status = `upload: ${i}`;
            video = await video.save();
            const file = `${i}-video.mp4`;
            await upload(svc.token, video.video[i], file);
            execSync(`rm -rf ${file}`);
            console.log(`${i} video was concated`);
          }
          video.status = 'finished';
          video = await video.save();
          execSync('rm -rf *.mp4');
          console.log('finished');
          setTimeout(() => watch(Video, Service), 3000);
        } catch (err) {
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
