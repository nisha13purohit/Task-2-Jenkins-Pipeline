const express = require('express');
const os = require('os');
const path = require('path');
const pkg = require('./package.json');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Health check (useful for Docker / monitoring / deployment checks)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Live server stats used by the dashboard
app.get('/api/status', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    app: pkg.name,
    version: pkg.version,
    commit: process.env.GIT_SHA || 'local',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: `${os.type()} ${os.arch()}`,
    hostname: os.hostname(),
    cpuCores: os.cpus().length,
    loadAvg: Number(os.loadavg()[0].toFixed(2)),
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      appMB: Number((mem.rss / 1024 / 1024).toFixed(1)),
      systemUsedMB: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
      systemTotalMB: Math.round(os.totalmem() / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
