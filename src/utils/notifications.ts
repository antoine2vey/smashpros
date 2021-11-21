import { applicationDefault, initializeApp } from "firebase-admin/app";
import { BaseMessage, getMessaging, TokenMessage } from "firebase-admin/messaging";
import path from "path";
import logger from "./logger";

initializeApp({
  credential: applicationDefault()
})

const messaging = getMessaging()

function getMessage(token: string, payload: BaseMessage): TokenMessage {
  return {
    ...payload,
    token
  }
}

export async function sendNotification(to: string, payload: BaseMessage) {
  const message = getMessage(to, payload)

  return messaging
    .send(message)
    .then(() => {
      logger.info(`Sent notification to ${to} (${JSON.stringify(message.data)})`)
    })
    .catch((error) => {
      logger.error(`Error sending notification to ${to}: ${error}`)
    })
}
