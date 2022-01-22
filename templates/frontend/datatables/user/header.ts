import { i18n } from '~/plugins/i18n'
import { DataTableHeader } from 'vuetify';

const headerDataTable = (): DataTableHeader[] => [
  {
    text: i18n.t('models.user.fields.id').toString(),
    align: 'center',
    sortable: true,
    value: 'id',
    class: 'v-header',
    cellClass: ''
  },
  {
    text: i18n.t('models.user.fields.name').toString(),
    align: 'center',
    sortable: true,
    value: 'name',
    class: 'v-header',
    cellClass: ''
  },
  {
    text: i18n.t('models.user.fields.email').toString(),
    align: 'center',
    sortable: true,
    value: 'email',
    class: 'v-header'
  },
  {
    text: i18n.t('models.user.fields.email_verified_at').toString(),
    align: 'center',
    sortable: true,
    value: 'emailVerifiedAt',
    class: 'v-header'
  },
  {
    text: i18n.t('crud.actions').toString(),
    value: 'actions',
    sortable: false,
    class: 'v-header',
    align: 'center'
  }
]

export default headerDataTable
