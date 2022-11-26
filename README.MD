# WebChApp

Web chat app. School project. Live demo at https://webchapp.herokuapp.com (Closes on 28th November when free dynos stop working).

The app has

- Websockets
- React stuff
- Node.js with express
- SQLite
- JWTs
- Probably something else too

## Quick start

0. Have `git` installed and access to `openssl` (or other software that can generate EC256 keys)
1. Clone the repository and enter the directory
2. Install app prerequisities
3. Enter the server directory and generate the required `private.key`
4. Build the server files and run `build/Secret.js`
5. Copy the JSON-formatted key from the output and insert it to `client/src/App.tsx` in the very beginning, replacing the current value of `pubKey` variable.
6. Observe `server/src/index.ts` and adjust the default port if needed. If you change the default value, remember to change it in `client/src/App.tsx` too!
7. Go back to project root and run `npm start` to start both, server and client.

### Detailed instructions

```bash
git clone https://github.com/saukkko/webchapp.git
cd webchapp
npm install
cd server
# Requires openssl
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -pkeyopt ec_param_enc:named_curve -out private.key
npm run build
node build/Secret.js
# Output:
# JWK-formatted, public part of the private key
# {
#   kty: 'EC',
#   x: 'H8WZ9ncnIftbSEpgRm1JwHXOaQ4F7KUGypwpydmOD5M',
#   y: '0IiHxwo6wns-Zmw_DMPzGC0ZG5_dnZ35wz2x83URDfM',
#   crv: 'P-256'
# }
```

Paste the output to `App.tsx`

```typescript
import React, { useEffect, useState } from "react";
import { compactVerify, createLocalJWKSet } from "jose";
import { ChatApp } from "./Chat";
import { ChatInput } from "./ChatInput";
import { Button, TextInput } from "./Inputs";
import type { User } from "./types";
import "./index.css";

const token = sessionStorage.getItem("token");

// insert your key here
const pubKey = {
  kty: "EC",
  x: "H8WZ9ncnIftbSEpgRm1JwHXOaQ4F7KUGypwpydmOD5M",
  y: "0IiHxwo6wns-Zmw_DMPzGC0ZG5_dnZ35wz2x83URDfM",
  crv: "P-256",
};

/* Change only if you decided to use other than default port in server/src/index.ts */
const getWsUrlBase = () => {
  // insert your express/websocket port here. Server uses environment variable NODE_PORT || 53000 by default.
  const WS_PORT = 53000;
  let urlbase = new URL(window.location.href);
  let wsurl = `ws://${urlbase.hostname}:${WS_PORT}`;
  if (process.env.NODE_ENV === "production")
    urlbase.protocol === "https:"
      ? (wsurl = `wss://${urlbase.hostname}`)
      : (wsurl = `ws://${urlbase.hostname}`);

  return new URL(wsurl);
};
```

Finally, return to project root and start the app

```bash
cd ..
npm start
```

### Deployment to heroku

- Install Docker and Heroku CLI
- Write `Dockerfile`
- Copy the necessary assets to build the image
- Manually build and test the Docker image
- Use Heroku CLI to push the container

#### Windows

```bat
cd heroku
npm run build --prefix ..
copy.bat
docker build -t webchapp .
heroku login
heroku container:login
heroku container:rm -a <your_heroku_app_name> web
heroku container:push -a <your_heroku_app_name> web
heroku container:release -a <your_heroku_app_name> web
```

## Disclaimer

The app may have bugs and your connection and chat messages are most likely NOT transferred securely. Don't use it if you don't understand the risks.
