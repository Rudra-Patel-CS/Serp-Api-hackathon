import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { config } from '../config'

let io: Server | null = null

export function initSocketServer(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`📡 Socket connected: ${socket.id}`)

    socket.on('join_user_channel', (userId: string) => {
      socket.join(`user:${userId}`)
      console.log(`User socket ${socket.id} joined channel user:${userId}`)
    })

    socket.on('join_shipment_track', (shipmentId: string) => {
      socket.join(`shipment:${shipmentId}`)
      console.log(`Socket ${socket.id} joined tracking for shipment:${shipmentId}`)
    })

    socket.on('leave_shipment_track', (shipmentId: string) => {
      socket.leave(`shipment:${shipmentId}`)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

export function emitShipmentLocationUpdate(shipmentId: string, locationData: any) {
  if (io) {
    io.to(`shipment:${shipmentId}`).emit('shipment_location_updated', {
      shipmentId,
      ...locationData,
      recordedAt: new Date().toISOString(),
    })
  }
}

export function emitOfferEvent(userId: string, offerData: any) {
  if (io) {
    io.to(`user:${userId}`).emit('offer_updated', offerData)
  }
}

export function emitNotificationEvent(userId: string, notificationData: any) {
  if (io) {
    io.to(`user:${userId}`).emit('new_notification', notificationData)
  }
}
