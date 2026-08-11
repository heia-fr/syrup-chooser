const express = require('express')
const path = require('path')
const app = express()

// Read from environment variables, or use defaults
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

// Runtime config for browser code
const MQTT_HOST = process.env.MQTT_HOST || HOST
const MQTT_PORT = process.env.MQTT_PORT || 8090
const MQTT_TOPIC_PREFIX = process.env.MQTT_TOPIC_PREFIX || 'heiafr/ms'

app.get('/config.js', (_req, res) => {
  res.type('application/javascript')
  res.send(
    `window.APP_CONFIG = ${JSON.stringify({
      MQTT_HOST,
      MQTT_PORT,
      MQTT_TOPIC_PREFIX,
    })};`,
  )
})

// Serve all static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')))

// Start the server bound to the specific host and port
const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`)
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
