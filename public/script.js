const $ = (id) => document.getElementById(id);

function formatUptime(total) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
}

async function refresh() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    $('uptime').textContent = formatUptime(data.uptimeSeconds);
    $('node').textContent = data.nodeVersion;
    $('load').textContent = data.loadAvg;
    $('cores').textContent = data.cpuCores;
    $('env').textContent = data.environment;
    $('commit').textContent = `v${data.version} · ${data.commit}`;

    const pct = Math.round((data.memory.systemUsedMB / data.memory.systemTotalMB) * 100);
    $('memText').textContent = `${data.memory.systemUsedMB} / ${data.memory.systemTotalMB} MB (${pct}%)`;
    $('memBar').style.width = pct + '%';
    $('appMem').textContent = data.memory.appMB + ' MB';
    $('host').textContent = `${data.hostname} · ${data.platform}`;
    $('updated').textContent = new Date(data.timestamp).toLocaleTimeString();

    $('live').textContent = '● Live';
    $('live').className = 'badge online';
  } catch (err) {
    $('live').textContent = '● Offline';
    $('live').className = 'badge offline';
  }
}

refresh();
setInterval(refresh, 2000);
