export default {
  SUCCESS: 'The operation has been successful',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  NOT_FOUND: (entity: string) => {
    return `${entity} not found`
  }
}
