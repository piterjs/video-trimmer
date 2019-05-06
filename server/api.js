const express = require('express');
const { google } = require('googleapis');

const { influx } = require('@piterjs/trimmer-shared');

const { Video, Build, Service, Hub } = require('./models');

const OAuth2 = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const credentials = require('./secrets/client_id.json');
const clientSecret = credentials.installed.client_secret;
const clientId = credentials.installed.client_id;
const redirectUrl = credentials.installed.redirect_uris[0];
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

const router = express.Router();

router.get('/me', async (req, res) => {
  const services = await Hub.find().exec();
  const ytauth = await Service.findOne({ service: 'youtube' }).exec();
  const youtube = ytauth._id !== null;
  res.status(200).json({
    ...req.user,
    youtube,
    services
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});

router.post('/add', async (req, res) => {
  const { body } = req;
  try {
    const data = await Video.create(body);
    const build = await Build.create({ video: data._id });
    data.builds = [build._id];
    await data.save();
    res.status(200).json({
      data: { ...data.toJSON(), builds: [build.toJSON()] }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const data = await Video.find().populate('builds').exec();
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/video/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'ID not set' });
    return;
  }
  try {
    const data = await Video.findOne({ _id: id }).populate('builds').exec();
    if (!data) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.status(200).json({
      data: data.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/video/:id/restart', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'ID not set' });
    return;
  }
  try {
    const data = await Video.findOne({ _id: id }).populate('builds').exec();
    if (!data) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    const build = await Build.create({ video: data._id });
    data.builds = [...data.builds.map(v => v._id), build._id];
    await data.save();
    res.status(200).json({
      data: data.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/build/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'ID not set' });
    return;
  }
  try {
    const build = await Build.findOne({ _id: id }).populate('video').exec();
    if (!build) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    const log = await influx.query(`SELECT * FROM watcher WHERE build = '${id}' AND step='download-stream'`);
    let steps = [
      'download-stream',
      'download-preroll'
    ];
    for (let i = 0; i < build.toJSON().video.video.length; i++) {
      steps = steps.concat([
        `download-preroll-${i}`,
        `trim-${i}`,
        `concat-${i}`,
        `upload-${i}`
      ]);
    }
    steps.push('end');
    res.status(200).json({
      build,
      steps,
      log
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get('/build/:id/log', async (req, res) => {
  const { params: { id }, query: { offset, step } } = req;
  if (!id) {
    res.status(400).json({ error: 'ID not set' });
    return;
  }
  if (!offset) {
    res.status(400).json({ error: 'ID not set' });
    return;
  }
  try {
    const build = await Build.findOne({ _id: id }).populate('video').exec();
    if (!build) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    const log = await influx.query(`select * from "watcher" where build = '${id}' and step = '${step}' limit 100 offset ${offset}`);
    res.status(200).json({
      build,
      log
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
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
          res.status(303).redirect('/');
        });
      } else {
        svc.token = token;
        svc.save((error, service) => {
          if (error) {
            res.status(400).json({ error });
            return;
          }
          res.status(303).redirect('/');
        });
      }
    });
  });
});

router.get('/youtube', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.redirect(authUrl);
});

module.exports = router;
