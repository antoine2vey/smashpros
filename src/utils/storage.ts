import { Storage } from '@google-cloud/storage'
import path from 'path'
import sharp from 'sharp'
import { Readable } from 'stream'
import logger from './logger'

const keyFilename = path.join(
  __dirname,
  '..',
  '..',
  'smashpros-51cf4f6569d5.json'
)
const storage = new Storage({ keyFilename })
const bucket = storage.bucket('smashpros')

export const sizes: { [key: string]: [number | null, number | null] } = {
  profile: [150, 150],
  crew: [200, 200],
  banner: [null, 250]
}

export async function ensureBucketExists() {
  try {
    await bucket.create()
  } catch (error) {
    logger.error('Bucket creation failed, already exists')
  }
}

export async function uploadFile(
  createReadStream: () => Readable,
  filename: string,
  sizes?: [number | null, number | null]
): Promise<string> {
  const blob = bucket.file(filename)
  const stream = createReadStream()

  return new Promise((resolve, reject) => {
    return stream
      .pipe(
        sharp()
          .resize(...sizes)
          .png()
      )
      .pipe(
        blob
          .createWriteStream({ resumable: false, gzip: true })
          .on('finish', async () => {
            try {
              await bucket.file(filename).makePublic()
              const url = blob.publicUrl()
              resolve(url)
            } catch (error) {
              reject(error)
            }
          })
          .on('error', reject)
      )
  })
}
