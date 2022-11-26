#!/bin/sh
set -e

sed -i.bak -e "s/##PORT##/${PORT}/" -e "s/##NODE_PORT##/${NODE_PORT}/" /etc/nginx/conf.d/default.conf
# /bin/s6-setuidgid app /usr/bin/node /app/app.js
/usr/bin/node /app/app.js
