const express = require('express');
const http = require('http');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const axios = require('axios');
const OAuth2Strategy = require('passport-oauth2');

const normalizePort = require('./helpers/normalizePort');
const apiRouter = require('./api');

const isAuth = require('./helpers/isAuth');

const staticPath = path.join(__dirname, 'public');

const { Hub } = require('./models');

const app = express();

app.use(cookieSession({
  maxAge: 7 * 24 * 60 * 60 * 1000,
  keys: ['randomstringhere']
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new OAuth2Strategy({
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  scope: '0-0-0-0-0',
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  const params = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  try {
    const [user, services] = await Promise.all([
      axios.get(`${process.env.OAUTHBASE_URL}/api/rest/users/me?fields=id,name,login,avatar`, params).then(v => v.data),
      axios.get(`${process.env.OAUTHBASE_URL}/api/rest/services/header?fields=id,name,applicationName,homeUrl,iconUrl`, params).then(v => v.data)
    ]);
    const hub = await Hub.find().exec();
    console.log(hub);
    for (let i = 0; i < services.length; i += 1) {
      if (!hub.find(v => v.key === services[i].id)) {
        await Hub.create({
          key: services[i].id,
          name: services[i].name,
          homeUrl: services[i].homeUrl,
          iconUrl: services[i].iconUrl
        });
      }
    }
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error, null);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', isAuth, apiRouter);
app.get('/auth', (req, res) => res.sendFile(path.join(staticPath, '..', 'auth.html')))
app.get('/auth/hub', passport.authenticate('oauth2'));
app.get('/auth/error', (req, res) => res.send('Authentication error'))
app.get(
  '/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/auth/error' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/*', function (req, res, next) {
  if (req.path.includes('/static') || req.path.includes('/favicon.ico') || req.path.includes('manifest.json')) {
    next();
    return;
  }
  isAuth(req, res, next);
});

app.use(express.static(staticPath));

app.get('/*', isAuth, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});
