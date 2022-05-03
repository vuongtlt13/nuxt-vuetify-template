import { i18n } from '~/plugins/i18n';
import { MenuType } from '~/utils/constants';

export interface Menu {
  type: string
  title: string
  icon?: string
  to?: string | object
  activeClass?: string
  class?: string
  tooltip?: string
  children?: Menu[]
}

const menuComponents: Menu[] = [
  {
    type: MenuType.NO_CHILD,
    title: i18n.t('models.user.menu_title').toString(),
    icon: 'mdi-account', // default: 'mdi-checkbox-blank-circle'
    to: {name: 'users'},
    activeClass: 'light-blue lighten-4 text--accent-4',
    children: []
  }
]

export default menuComponents
