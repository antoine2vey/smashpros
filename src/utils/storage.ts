import { Storage } from "@google-cloud/storage";
import path from "path";
import { Readable } from "stream";
import logger from "./logger";

const keyFilename = path.join(__dirname, '..', '..', 'smashpros-51cf4f6569d5.json')
const storage = new Storage({ keyFilename })
const bucket = storage.bucket('smashpros')

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
  mimetype: string
): Promise<string> {
  const blob = bucket.file(filename)
  const stream = createReadStream()

  return new Promise((resolve, reject) => {
    stream.pipe(
      blob.createWriteStream()
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