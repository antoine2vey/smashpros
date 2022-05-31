import mongoose, { mongo, ObjectId } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

interface Zone {
  name: string
  picture: string
  country_code: string
  polygons: Polygon[]
}

interface Polygon {
  type: string
  coordinates: number[][][]
  vertices: number
  zone: Zone
}

interface Tournament {
  ref: number
  location: [number, number]
}

export async function connectMongo() {
  return mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME
  })
}

export async function tearMongoConnection() {
  return mongoose.disconnect()
}

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
})

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true
  },
  vertices: {
    type: Number,
    required: true
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true
  }
})

const zoneSchema = new mongoose.Schema<Zone>({
  name: String,
  picture: String,
  country_code: {
    required: true,
    type: String
  },
  polygons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Polygon'
    }
  ]
})

const tournamentSchema = new mongoose.Schema<Tournament>({
  ref: Number,
  location: pointSchema
})

export const Zone = mongoose.model<Zone>('Zone', zoneSchema)
export const Polygon = mongoose.model<Polygon>('Polygon', polygonSchema)
export const Tournament = mongoose.model<Tournament>(
  'Tournament',
  tournamentSchema
)
