// eslint-disable-next-line import/no-mutable-exports
let $error: any

export function initializeError (error: any) {
  $error = error
}

export { $error }
