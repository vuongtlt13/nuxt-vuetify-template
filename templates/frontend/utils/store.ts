// eslint-disable-next-line import/no-mutable-exports
let $store: any

export function initializeStore (store: any) {
  $store = store
}

export { $store }
