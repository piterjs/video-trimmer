const express = require('express');
const { google } = require('googleapis');

const { influx } = require('@piterjs/trimmer-shared');

const { Video, Build, Service, Hub } = require('./models');

const kube = require('./kubernetes');

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
    if (process.env.KUBE_SERVER) {
      await kube(data._id, build._id);
    }
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
    if (process.env.KUBE_SERVER) {
      await kube(data._id, build._id);
    }
    res.status(200).json({
      data: data.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

const genStep = (key, nextKey, stage, st) => {
  const x = ['error', 'end'];
  if (x.includes(key)) {
    if (!st.find(v => v.value === key)) {
      return null;
    }
    return {
      key,
      stage: 'final',
      state: key === 'error' ? 'error' : 'ready'
    }
  }
  const has = !!st.find(v => v.value === key);
  const hasNext = !!st.find(v => x.includes(nextKey) ? x.includes(v.value) : v.value === nextKey);
  return {
    key,
    stage,
    state: has && hasNext ? 'ready' : has ? 'in-progress' : 'waiting'
  }
};

const getSteps = async (id, len) => {
  const st = await influx.query(`SHOW TAG VALUES FROM "watcher" WITH KEY = "step" where build = '${id}'`);
  let keys = [
    'download-stream',
    'download-preroll'
  ];
  for (let i = 0; i < len; i++) {
    keys = keys.concat([
      `download-preroll-${i}`,
      `trim-${i}`,
      `concat-${i}`,
      `upload-${i}`
    ]);
  }
  keys = keys.concat(['error', 'end']);

  let steps = [];

  for (let i = 0; i < keys.length; i++) {
    const len = keys.length - 1;
    const nk = i === len ? keys[i] : keys[i + 1];
    const mv = keys[i].match(/-([0-9])/);
    const stage = mv ? `video-${mv[1]}` : 'init';
    if (mv) {
      steps.push({ ...genStep(keys[i], nk, stage, st), i: parseInt(mv[1], 10) });
    } else {
      steps.push(genStep(keys[i], nk, stage, st));
    }
  }
  steps = steps.filter(v => v);
  const fe = steps.findIndex(v => v.key === 'error')
  if (fe !== -1) {
    steps[fe - 1].state = 'error';
  }
  const group = [];
  for (let i = 0; i < steps.length; i++) {
    const fi = group.findIndex(v => v.name === steps[i].stage);
    if (fi === -1) {
      group.push({
        name: steps[i].stage,
        i: steps[i].i >= 0 ? steps[i].i : -1,
        keys: [steps[i]]
      })
    } else {
      group[fi].keys.push(steps[i]);
    }
  }
  return group;
}

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
    const steps = await getSteps(id, build.toJSON().video.video.length);
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
    const log = await influx.query(`select * from "watcher" where build = '${id}' and step = '${step}' offset ${offset}`);
    const steps = await getSteps(id, build.toJSON().video.video.length);
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
