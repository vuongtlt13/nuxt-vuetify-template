import { i18n } from '~/plugins/i18n';
import { HttpCode } from '~/utils/constants';

export default async ({ store, route, redirect }: any) => {
  if (store.getters['auth/isSuperAdmin']) return;

  const requiredPermissions: string[] = [];
  route.meta.map((meta: any) => {
    if (meta.rp) requiredPermissions.push(...meta.rp)
  })

  if (requiredPermissions.length == 0) return;

  if (!store.getters['auth/check']) return redirect('auth/login')

  const permissions: string[] = store.getters['auth/user'].permissions
  let hasPermission = true
  requiredPermissions.map((permission) => {
    if (!permissions.includes(permission)) hasPermission = false;
  })

  if (!hasPermission) throw({ statusCode: HttpCode.PERMISSION_DENIED, message: i18n.t("auth.permission_denied") })
}
