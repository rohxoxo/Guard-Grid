export type THttpResponse = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    meathod: string
    url: string
  }
  message: string
  data: unknown
}

export type THttpError = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    meathod: string
    url: string
  }
  message: string
  data: unknown
  trace?: object | null
}
