import cron from 'node-cron'

function run(pattern: string, callback: () => void) {
  if (process.env.NODE_ENV === 'production') {
    return cron.schedule(pattern, callback)
  }

  callback()
}

export function runAtMidnight(callback: () => void) {
  return run('0 0 * * *', callback)
}