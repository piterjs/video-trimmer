const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');

const { videoSchema, serviceSchema } = require('shared');

const OAuth2 = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const credentials = require('./secrets/client_id.json');
const clientSecret = credentials.installed.client_secret;
const clientId = credentials.installed.client_id;
const redirectUrl = credentials.installed.redirect_uris[0];
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

const Video = mongoose.model('Video', videoSchema);
const Service = mongoose.model('Service', serviceSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongodb connected');
});

const router = express.Router();

router.post('/add', (req, res) => {
  const { body } = req;
  const video = new Video(body);
  video.save((error, data) => {
    if (error) {
      res.status(400).json({ error });
      return;
    }
    res.status(200).json({ data });
  });
});

router.get('/list', (req, res) => {
  Video.find((error, data) => {
    if (error) {
      res.status(400).json({ error });
      return;
    }
    res.status(200).json({ data });
  });
});

router.get('/youtube/auth', (req, res) => {
  const { query: { code } } = req;
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: `Error while trying to retrieve access token: ${err}` })
      return;
    }
    oauth2Client.credentials = token;
    Service.findOne({ service: 'youtube' }, (err, svc) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: err });
        return;
      }
      if (!svc) {
        const service = new Service({
          service: 'youtube',
          token
        });
        service.save((error, data) => {
          if (error) {
            res.status(400).json({ error });
            return;
          }
          res.status(200).json({ data });
        });
      } else {
        svc.token = token;
        svc.save((error, service) => {
          if (error) {
            res.status(400).json({ error });
            return;
          }
          res.status(200).json({ data: service });
        });
      }
    });
  });
});

router.get('/youtube', (req, res) => {
  Service.findOne({ service: 'youtube' }, (err, svc) => {
    if (err || !svc) {
      if (err) {
        console.log(err);
      }
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      res.redirect(authUrl);
      return;
    }
    res.redirect('/')
  });
});

module.exports = router;
