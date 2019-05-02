const fs = require('fs');
const { google } = require('googleapis');
const { writeLog } = require('@piterjs/trimmer-shared');

const OAuth2 = google.auth.OAuth2;
const credentials = require('./secrets/client_id.json');
const clientSecret = credentials.installed.client_secret;
const clientId = credentials.installed.client_id;
const redirectUrl = credentials.installed.redirect_uris[0];
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

const upload = async (id, step, token, info, file) => {
  oauth2Client.credentials = token;
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });
  const fileSize = fs.statSync(file).size;
  const res = await youtube.videos.insert({
    part: 'id,snippet,status',
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title: info.title,
        description: info.description,
        tags: info.tags
      },
      status: {
        privacyStatus: 'private'
      }
    },
    media: {
      body: fs.createReadStream(file)
    }
  }, {
    onUploadProgress: async (evt) => {
      const progress = (evt.bytesRead / fileSize) * 100;
      await writeLog(id, step, `${Math.round(progress)}% complete`);
    }
  });
  await writeLog(id, step, res.data);
  return res.data;
};

module.exports = upload;
