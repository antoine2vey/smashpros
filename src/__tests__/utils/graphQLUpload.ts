import { readFileSync } from 'fs'
import { Readable } from 'stream'
import { Upload } from 'graphql-upload/public'

export default function graphQLUpload(path) {
  const file = Readable.from(readFileSync(path, 'utf-8'))
  const upload = new Upload()

  upload.promise = new Promise((resolve) =>
    resolve({
      createReadStream: () => file,
      filename: 'test_profile_picture.jpg',
      mimetype: 'image/jpg'
    })
  )
  upload.file = upload.promise

  return upload
}
