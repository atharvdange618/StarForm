module.exports = {
  apps: [
    {
      name: 'starform-api',
      script: 'dist/index.js',
      cwd: __dirname,
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        PORT: 8000,
        NODE_ENV: 'production',
      },
    },
  ],
};
