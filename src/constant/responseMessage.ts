export default {
  SUCCESS: 'The operation has been successful',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  NOT_FOUND: (entity: string) => {
    return `${entity} not found`
  }
}
