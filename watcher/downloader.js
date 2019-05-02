const { execSync, spawn } = require('child_process');
const { writeLog } = require('@piterjs/trimmer-shared');

const youtubeDL = execSync('which youtube-dl').toString().trim();

const downloader = async (id, step, url, file) => {
  await writeLog(id, step, `start download ${file} from ${url}`);
  return new Promise((resolve, reject) => {
    let error = '';
    const workerProcess = spawn(youtubeDL, ['-f', 'best', '--merge-output-format', 'mp4', '-o', file, url]);
    workerProcess.stdout.on('data', async (data) => {
      await writeLog(id, step, data.toString());
    });

    workerProcess.stderr.on('data', async (data) => {
      await writeLog(id, step, data.toString());
    });

    workerProcess.on('close', async (code) => {
      await writeLog(id, step, `download end with code ${code}`);
      if (code !== 0) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = downloader;
