const { execSync, spawn } = require('child_process');

const youtubeDL = execSync('which youtube-dl').toString().trim();

const downloader = (url, file) => {
  console.log(`start download ${file} from ${url}`);
  return new Promise((resolve, reject) => {
    let error = '';
    const workerProcess = spawn(youtubeDL, ['-o', file, url]);
    workerProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    workerProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    workerProcess.on('close', (code) => {
      console.log('download end with code ' + code);
      if (code !== 0) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = downloader;
