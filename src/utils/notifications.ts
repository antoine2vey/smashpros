import { getMessaging, TokenMessage } from "firebase-admin/messaging";
import logger from "./logger";

const messaging = getMessaging()

function getMessage(token: string, data: { [key: string]: any }): TokenMessage {
  return {
    data,
    token
  }
}

export async function sendNotification(to: string, data: { [key: string]: any }) {
  const message = getMessage(to, data)

  return messaging
    .send(message)
    .then(() => {
      logger.info(`Sent notification to ${to} (${JSON.stringify(message.data)})`)
    })
    .catch((error) => {
      logger.error(`Error sending notification to ${to}: ${error}`)
    })
}
