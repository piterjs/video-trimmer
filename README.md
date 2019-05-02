# Video trimmer
[![Build Status](https://ci.piterjs.org/api/badges/piterjs/video-trimmer/status.svg)](https://ci.piterjs.org/piterjs/video-trimmer)

## Directories
- /server - backend
- /app - react app
- /shared - shared source
- /watcher - trimmer & uploader service

## How to Contribute
Already a JavaScript developer? Pick an [issue](https://yt.piterjs.dev/issues/VT), push a PR.

**Prerequisites:**
- [git](https://git-scm.com/)
- [docker](https://hub.docker.com/search/?type=edition&offering=community) / [docker-compose](https://docs.docker.com/compose/)
- [NodeJS](https;//nodejs.org) >= 8
- [youtube](https://developers.google.com/youtube/v3/quickstart/nodejs) **step 1**

### Development
1. clone repo `git clone https://github.com/piterjs/video-trimmer.git`
1. install dependencies `make dep && make templates`
1. Edit envs `vim server/.env`
1. Copy youtube secrets
  * `mv youtube_client_secret.json server/secrets/client_id.json`
  * `mv youtube_client_secret.json watcher/secrets/client_id.json`
1. start backend `cd server && npm run dev`
1. start app `cd app && npm run dev`
1. start watcher `cd watcher && npm run dev`
