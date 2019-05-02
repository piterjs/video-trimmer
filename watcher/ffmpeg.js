const { execSync, spawn } = require('child_process');
const { writeLog } = require('@piterjs/trimmer-shared');

const ffmpegExec = execSync('which ffmpeg')
  .toString()
  .trim();

const ffmpeg = (id, step, args) => {
  return new Promise(async (resolve, reject) => {
    let error = '';
    args.push('-y');
    await writeLog(id, step, `ffmpeg ${args.join(' ')}`);
    const workerProcess = spawn(ffmpegExec, args, { shell: true });
    workerProcess.stdout.on('data', async (data) => {
      await writeLog(id, step, data.toString());
    });

    workerProcess.stderr.on('data', async (data) => {
      await writeLog(id, step, data.toString());
    });

    workerProcess.on('close', async (code) => {
      await writeLog(id, step, `ffmpeg end with code ${code}`);
      if (code !== 0) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
const concatVideo = async (id, step, one, two, three, to, start, end) => {
  const time = calculateEndTime(start, end);
  const [h, m, s] = time.split(':');
  let nt = 0;
  nt = nt + parseInt(s, 10);
  nt = nt + (parseInt(m, 10) * 60);
  nt = nt + (parseInt(h, 10) * 60 * 60);
  const filterComplex = [
    '[0:v]fade=type=out:duration=1:start_time=9,setpts=PTS-STARTPTS[v0];',
    `[1:v]fade=type=in:duration=1,fade=type=out:duration=1:start_time=${nt - 1},setpts=PTS-STARTPTS[v1];`,
    '[2:v]fade=type=in:duration=1,setpts=PTS-STARTPTS[v2];',
    '[v0][3:a] [v1][1:a] [v2][3:a] concat=n=3:v=1:a=1 [v] [a]'
  ];
  const c = await ffmpeg(id, step, [
    '-i', one,
    '-i', two,
    '-i', three,
    '-f', 'lavfi',
    '-t', 3,
    '-i', 'anullsrc',
    '-filter_complex', `"${filterComplex.join(' ')}"`,
    '-c:v', 'h264',
    '-c:a', 'aac',
    '-map', '"[v]"',
    '-map', '"[a]"',
    to
  ]);
  return c;
};

const toDn = n => {
  n = n.toString();
  if (n.length < 2) {
    n = `0${n}`;
  }
  return n;
};

const calculateEndTime = (start, end) => {
  const sa = start.split(':');
  const ea = end.split(':');
  sa.reverse();
  ea.reverse();
  let mind = 0;
  let nt = [];
  for (let i = 0; i < 3; i += 1) {
    let nv = ea[i] - sa[i] - mind;
    if (nv < 0) {
      nv = nv * -1;
      mind = 1;
      nv = 60 - nv;
      nt.push(toDn(nv));
    } else {
      mind = 0;
      nt.push(toDn(nv));
    }
  }
  nt.reverse();
  return nt.join(':');
};

const trimVideo = async (id, step, from, to, start, end, args = []) => {
  let params = [
    '-ss', start,
    '-i', from,
    '-to', calculateEndTime(start, end)
  ];
  if (args && args.length > 0) {
    params = [...params, ...args]
  } else {
    params = [...params, '-c', 'copy'];
  }
  params.push(to);
  const trimming = await ffmpeg(id, step, params);
  return trimming;
};

module.exports = {
  trimVideo,
  concatVideo
};
