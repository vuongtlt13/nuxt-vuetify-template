export const TOKEN_KEY = 'vtk'
export const NOTIFICATION_DURATION = 5000

export enum ModalActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

export enum HttpCode {
  SUCCESS = 200,

  BAD_PAYLOAD = 400,
  UNAUTHORIZED = 401,
  PERMISSION_DENIED = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOW = 405,

  SERVER_ERROR = 500,
}
