import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

interface Zone {
  name: string
  picture: string
  location: number[][][]
}

interface Tournament {
  ref: number
  location: [number, number]
}

export async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME
  })
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
  }
})

const zoneSchema = new mongoose.Schema<Zone>({
  name: String,
  picture: String,
  location: polygonSchema
})

const tournamentSchema = new mongoose.Schema<Tournament>({
  ref: Number,
  location: pointSchema
})

export const Zone = mongoose.model<Zone>('Zone', zoneSchema)
export const Tournament = mongoose.model<Tournament>(
  'Tournament',
  tournamentSchema
)
