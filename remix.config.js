/** @type {import('@remix-pwa/dev').WorkerConfig} */
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ['sw','@remix-pwa/cache', '@remix-pwa/client', "@remix-pwa/push","@remix-pwa/strategy","@remix-pwa/sw", "@remix-pwa/sync","@remix-pwa/dev","@remix-pwa/worker-runtime",'remix-pwa'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
