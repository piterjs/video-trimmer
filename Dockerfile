FROM mhart/alpine-node:8

WORKDIR /app
COPY server/ .
COPY app/build/ public

RUN npm install

CMD ["node", "index.js"]
