FROM alfg/ffmpeg:latest

WORKDIR /app
COPY . .

RUN apk update \
    && apk add curl python2 nodejs-current nodejs-npm \
    && curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl \
    && chmod a+rx /usr/local/bin/youtube-dl \
    && /usr/local/bin/youtube-dl --version \
    && npm install

CMD ["node", "index.js"]
