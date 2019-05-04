const inf = require('influx');

const influx = new inf.InfluxDB({
  host: process.env.INFLUX_HOST,
  port: process.env.INFLUX_PORT,
  database: process.env.INFLUX_DB,
  schema: [
    {
      measurement: 'watcher',
      fields: {
        str: inf.FieldType.STRING
      },
      tags: [
        'build',
        'step'
      ]
    }
  ]
});

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(process.env.INFLUX_DB)) {
      return influx.createDatabase(process.env.INFLUX_DB);
    }
  })
  .then(() => {
    console.log('influx connected');
  })
  .catch(err => {
    console.error('Error creating Influx database!', err);
  });

const writeLog = (build, step, str) => {
  if (typeof str === 'object') {
    str = JSON.stringify(str);
  }
  influx.writePoints([
    {
      measurement: 'watcher',
      tags: { build, step },
      fields: { str }
    }
  ])
    .then(() => console.log(str))
    .catch(err => console.error(`Error saving data to InfluxDB! ${err.stack}`, str))
};

module.exports = {
  influx,
  writeLog
};
