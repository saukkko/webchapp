FROM node:alpine as copy

RUN mkdir -pv /app/server/src
RUN mkdir -pv /app/server/build

COPY server/src /app/server/src/
COPY server/package-lock.json /app/server
COPY server/package.json /app/server
COPY server/tsconfig.json /app/server


# build
FROM copy as build

WORKDIR /app
RUN npm install --prefix server
RUN npm run build --prefix server


# install
FROM node:alpine as install
ARG NODE_ENV="production"

RUN mkdir -pv /app/client
RUN mkdir -pv /app/server

COPY --from=build /app/server/build /app/server
COPY --from=build /app/server/package-lock.json /app
COPY --from=build /app/server/package.json /app

WORKDIR /app
RUN npm ci

# deploy / config
FROM nginx:alpine as deploy
RUN apk update && apk upgrade && apk add nodejs npm s6
RUN touch /var/run/app.pid
RUN touch /var/run/nginx.pid
RUN mkdir /var/cache/nginx/client_temp

COPY --from=install /app /app
COPY client/ /app/client/
COPY assets/nginx.conf /etc/nginx/nginx.conf
COPY assets/server.conf /etc/nginx/conf.d/default.conf
COPY assets/private.key /app/
COPY assets/app.js /app/

RUN adduser -D app
RUN chown -R app /app/
RUN chown app /var/run/app.pid
RUN chown -R app /etc/nginx/
RUN chown -R app /var/cache/nginx/
RUN chown -R app /var/log/nginx/
RUN chown app /var/run/nginx.pid


# run
FROM deploy as run
COPY assets/start-app.sh /docker-entrypoint.d/start-app.sh

ARG PORT=8080
ENV NODE_PORT=53000
ENV NODE_ENV="production"
ENV PORT=${PORT}


RUN export NODE_PORT=${NODE_PORT}
RUN export NODE_ENV=${NODE_ENV}
RUN export PORT=${PORT}
EXPOSE ${PORT}

USER app
# ENTRYPOINT [ "/bin/ash" ]
