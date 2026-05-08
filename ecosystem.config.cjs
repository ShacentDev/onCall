module.exports = {
  apps: [
    {
      name: "oncall",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      cwd: "C:\\Users\\muhammad.hauzan\\Documents\\GitHub\\onCall",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};