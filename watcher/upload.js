const fs = require('fs');
const Youtube = require('youtube-api');

const credentials = require('./client_id.json');
const clientId = credentials.installed.client_id;
const clientSecret = credentials.installed.client_secret;
const redirectUrl = credentials.installed.redirect_uris[0];

let oauth = Youtube.authenticate({
  type: 'oauth',
  client_id: clientId,
  client_secret: clientSecret,
  redirect_url: redirectUrl
});

const upload = (token, info, file) => {
  oauth.setCredentials(token);
  let interval = null;
  return new Promise((resolve, reject) => {
    var req = Youtube.videos.insert({
      resource: {
        snippet: {
          title: info.title,
          description: info.description,
          tags: info.tags
        },
        status: {
          privacyStatus: 'private'
        }
      },
      part: 'snippet,status',
      media: {
        body: fs.createReadStream(file)
      }
    }, (err, data) => {
      clearInterval(interval);
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
    interval = setInterval(function () {
      console.log(`${req.req.connection._bytesDispatched} bytes uploaded.`);
    }, 250);
  });
};

module.exports = upload;
