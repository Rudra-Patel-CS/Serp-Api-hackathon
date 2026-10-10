import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import http from 'http'
import app from './app'
import { config } from './config'
import { initSocketServer } from './realtime/socket.server'

const server = http.createServer(app)

initSocketServer(server)

server.listen(config.port, () => {
  console.log(`🚀 KrishiIntel Backend Server running on port ${config.port}`)
  console.log(`🌐 API Endpoint: ${config.backendUrl}/api`)
  console.log(`📡 Socket.IO Listening for Real-Time Connections`)
})
