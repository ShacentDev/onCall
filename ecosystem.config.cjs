module.exports = {
  apps: [
    {
      name: "internal",
      script: "node_modules/next/dist/bin/next",
      args: "dev",
      cwd: "C:\\Users\\muhammad.hauzan\\Documents\\GitHub\\onCall",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};