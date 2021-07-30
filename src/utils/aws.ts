import AWS from 'aws-sdk'

AWS.config.update({
  region: 'eu-west-1',
  credentials: new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  })
})

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export function ensureBucketExists(bucketName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    s3.createBucket({ Bucket: bucketName }, (err, data) => {
      if (err) {
        if (err.code === 'BucketAlreadyOwnedByYou') {
          resolve()
        } else {
          reject()
        }
      } else {
        resolve()
      }
    })
  })
}

export function uploadFile(
  createReadStream: () => AWS.S3.Body,
  filename: string,
  mimetype: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const stream = createReadStream()
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_USER_BUCKET,
      Key: filename,
      Body: stream,
      ContentType: mimetype
    }

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.Location)
      }
    })
  })
}