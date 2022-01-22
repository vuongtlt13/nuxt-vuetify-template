import { configure, extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import * as rules from 'vee-validate/dist/rules'
import { i18n } from '~/plugins/i18n'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// with typescript
for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, validation)
}

configure({
  // this will be used to generate messages.
  // @ts-ignore
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`)
    const errorPrefix = i18n.t('validations.prefix_error', { field })
    const mainError = i18n.t(`validations.${values._rule_}`, values)
    return `${errorPrefix} ${mainError}`
  }
})
