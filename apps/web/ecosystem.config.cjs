module.exports = {
  apps: [
    {
      name: 'starform-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname,
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        PORT: 3003,
        NODE_ENV: 'production',
      },
    },
  ],
};
