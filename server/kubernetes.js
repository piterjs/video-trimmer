const k8s = require('@kubernetes/client-node');
const cluster = {
  name: 'worker',
  server: process.env.KUBE_SERVER,
  caData: process.env.KUBE_CA
};

const user = {
  token: process.env.KUBE_TOKEN
};

const context = {
  name: 'watcher',
  user: user.name,
  cluster: cluster.name,
  namespace: process.env.KUBE_NAMESPACE
};

const kc = new k8s.KubeConfig();
kc.loadFromOptions({
  clusters: [cluster],
  users: [user],
  contexts: [context],
  currentContext: context.name
});

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

module.exports = (video, build) => {
  const body = {
    metadata: {
      name: `trimmer-job-${build}`,
      namespace: process.env.KUBE_NAMESPACE,
      annotations: {
        'dev.piterjs.trimmer': 'true',
        'dev.piterjs.trimmer.created': Date.now().toString(),
        'dev.piterjs.trimmer.id': build,
        'dev.piterjs.trimmer.video': video
      }
    },
    spec: {
      backoffLimit: 0,
      TTLSecondsAfterFinished: 60 * 60 * 24 * 3,
      template: {
        spec: {
          restartPolicy: 'Never',
          containers: [
            {
              name: `trimmer-job-${build}`,
              imagePullPolicy: 'Always',
              image: 'piterjs/trimmer-watcher:latest',
              env: [
                { name: 'BUILD_ID', value: build.toString() },
                { name: 'MONGO_URL', value: process.env.MONGO_URL },
                { name: 'INFLUX_HOST', value: process.env.INFLUX_HOST },
                { name: 'INFLUX_PORT', value: process.env.INFLUX_PORT },
                { name: 'INFLUX_DB', value: process.env.INFLUX_DB }
              ]
            }
          ]
        }
      }
    }
  };
  return k8sApi.createNamespacedJob(process.env.KUBE_NAMESPACE, body)
    .then(() => k8sApi.listNamespacedJob(process.env.KUBE_NAMESPACE));
}
