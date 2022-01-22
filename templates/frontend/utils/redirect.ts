// eslint-disable-next-line import/no-mutable-exports
let $redirect: any

export function initializeRedirect (redirect: any) {
  $redirect = redirect
}

export { $redirect }
