FROM node:26-alpine
WORKDIR /app

RUN apk add --no-cache tini

ENV HOST=0.0.0.0
ENV PORT=3000
ENV MQTT_HOST=localhost
ENV MQTT_PORT=8090
ENV MQTT_TOPIC_PREFIX=heiafr/ms

COPY package.json package-lock.json ./
COPY index.js ./
COPY public ./public

RUN npm install --production

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]