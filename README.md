# Syrup Chooser

Web UI for the Machine a Sirops (Syrup Machine) race.

This app serves a page with 3 syrup buttons. When a button is pressed, the UI publishes an MQTT command message and disables the button until a matching MQTT done message is received (or timeout).

Note: In the MQTT topic prefix, ms means "Machine a Sirops".

## Features

- 3 large buttons for syrup selection
- MQTT over WebSocket connection from browser
- Runtime MQTT config injected by server via /config.js
- Graceful button re-enable on done message
- Safety timeout (30 seconds)

## Project structure

- index.js: Express server, static hosting, runtime config endpoint
- public/index.html: UI and MQTT client logic
- public/js/mqtt.min.js: MQTT client library
- Dockerfile: container image definition

## Run locally

Requirements:

- Node.js

Install dependencies and start:

```bash
npm install
npm run serve
```

Open in browser:

- http://localhost:3000

## Run with Docker

Build image:

```bash
docker build -t syrup-chooser .
```

Run container:

```bash
docker run --rm -p 3000:3000 syrup-chooser
```

Run with custom MQTT settings:

```bash
docker run --rm -p 3000:3000 \
  -e MQTT_HOST=broker.example.local \
  -e MQTT_PORT=9001 \
  -e MQTT_TOPIC_PREFIX=heiafr/ms \
  syrup-chooser
```

## Environment variables

Server:

- HOST (default: localhost, Docker sets 0.0.0.0)
- PORT (default: 3000)

Runtime MQTT config (sent to browser in /config.js):

- MQTT_HOST (default: localhost)
- MQTT_PORT (default: 8090)
- MQTT_TOPIC_PREFIX (default: heiafr/ms)

## MQTT message roles

Topics are built from MQTT_TOPIC_PREFIX.

### 1. Command topic (UI to controller)

Topic:

- <MQTT_TOPIC_PREFIX>/controller/button

Payload:

- "1", "2", or "3" (string)

Role:

- Sent when user presses one of the three syrup buttons.
- Identifies which syrup action to start.

### 2. Done topic (controller to UI)

Topic:

- <MQTT_TOPIC_PREFIX>/controller/done

Payload:

- "1", "2", or "3" (string)

Role:

- Sent by controller when requested action is finished.
- UI re-enables matching button and hides spinner.

## UI flow

1. User clicks button 1, 2, or 3.
2. UI disables button and shows spinner.
3. UI publishes selected button id to command topic.
4. Controller processes request.
5. Controller publishes matching id to done topic.
6. UI re-enables button and clears spinner.
7. If no done message arrives within 30 seconds, UI auto-releases button.
