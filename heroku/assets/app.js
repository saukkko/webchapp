import { writeFile } from "fs/promises";
import { spawn, exec } from "child_process";

// this file will only work on linux / posix / unix-like OSes
if (process.platform !== "linux") process.exit(1);

// kill existing express
exec('kill -SIGINT "$(cat /var/run/app.pid)"');

process.chdir("/app");
// spawn new app, detach and ignore stdio
const express = spawn("/usr/bin/node", ["server/index.js"], {
  detached: true,
  stdio: ["ignore", process.stdout, process.stderr],
});

// write pid to file, unref() from event loop and print pid to console
writeFile("/var/run/app.pid", express.pid.toString())
  .catch(console.error)
  .then(() => {
    express.unref();
    console.log(`app forked to background. pid: ${express.pid}`);
  });
