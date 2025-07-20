import { createLogger, format, transports } from 'winston'
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'
import util from 'util'
import { EApplicationEnvironment } from '../constant/application'
import config from '../config/config'
import path from 'path'
import * as sourceMapSupport from 'source-map-support'

//linking trace support
sourceMapSupport.install()

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if ((config.ENV = EApplicationEnvironment.DEVELOPMENT)) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.timestamp(),
          format.printf(({ timestamp, level, message, meta }) => {
            const metaString = util.inspect(meta, {
              showHidden: false,
              depth: null
            })
            return `[${timestamp}] ${level.toUpperCase()}: ${message} \n${'Meta'} ${metaString}\n`
          })
        )
      })
    ]
  } else {
    return []
  }
}

const fileLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info

  const logMeta: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || ''
      }
    } else {
      logMeta[key] = value
    }
  }

  const logData = {
    level: level.toUpperCase(),
    message,
    timestamp,
    meta: logMeta
  }

  return JSON.stringify(logData, null, 4)
})

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat)
    })
  ]
}

export default createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...fileTransport(), ...consoleTransport()]
})
