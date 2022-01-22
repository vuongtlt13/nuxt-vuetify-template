<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <InputTextFieldWithValidation
        v-model="data.name"
        :label="$t('models.user.fields.name')"
        name="name"
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <InputTextFieldWithValidation
        v-model="data.password"
        :label="$t('models.user.fields.password')"
        name="password"
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <InputTextFieldWithValidation
        v-model="data.email"
        :label="$t('models.user.fields.email')"
        name="email"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, Ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import User from '~/dto/user'

export default defineComponent({
  name: 'Fields',
  props: {
    initData: {
      type: Object,
      default: () => new User()
    },
    onChange: {
      type: Function,
      default: null
    }
  },
  setup (props, { emit }) {
    const data: Ref<User> = useVModel(props, 'initData', emit) as Ref<User>
    watch(data, (currentValue, _) => {
      if (props.onChange) {
        // @ts-ignore
        props.onChange(currentValue)
      }
    })
    return {
      data
    }
  }
})
</script>

<style scoped>

</style>
