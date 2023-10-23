const fs = require('fs');
const dotenv = require('dotenv');

const instances = 1;
const baseEnv = {};

//generate baseEnv from .env file

const envConfig = dotenv.parse(fs.readFileSync('.env'));

for (const k in envConfig) {
  baseEnv[k] = envConfig[k];
}

module.exports = {
  apps: [
    {
      name: 'NESTJS PRISMA API - DEV',
      script: './dist/main.js',
      ignore_watch: ['node_modules'],
      instances: instances,
      autorestart: false,
      watch: false,
      exec_mode: 'cluster',
      env: baseEnv,
    },
  ],
};
