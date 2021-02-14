import { isEmpty } from 'lodash';
import { createLogger, format, transports } from 'winston'
const { combine, json, colorize, printf, timestamp } = format

const devLogFormat = () => printf(({ level, message, timestamp, durationMs, ...meta }) => {
  let str = `${timestamp} - ${level}: ${message}`;

  if (!isEmpty(meta)) {
    str += ` \n${JSON.stringify(meta, undefined, 2)}`
  }

  if (durationMs) {
    str += ` [${durationMs}ms]`
  }

  return str
});

const logger = createLogger({
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new transports.File({
      filename: 'combined.log'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        timestamp({ format: 'HH:MM:ss.SSS' }),
        colorize(),
        devLogFormat()
      )
    })
  )
}

export default logger
