module.exports = {
  apps: [
    {
      name: "tezi-web-prod",
      script: "./src/index.ts",
      env: {
        PORT: 8080, // Port for the release server
        NODE_ENV: "production",
        DB_SYNC: process.env.DB_SYNC || false,
      },
      interpreter: "/root/.bun/bin/bun",
    }
  ],
};