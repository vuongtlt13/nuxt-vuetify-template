<template>
  <v-row>
    <!-- Name Field -->
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <ValidationText
        v-model="data.name"
        rules="required|max:255"
        counter="255"
        :label="$t('models.user.fields.name')"
        name="name"
      />
    </v-col>

    <!-- Email Field -->
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <ValidationEmail
        v-model="data.email"
        :label="$t('models.user.fields.email')"
        name="email"
        counter="255"
      />
    </v-col>

    <!-- Password Field -->
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <ValidationPassword
        v-model="data.password"
        :label="$t('models.user.fields.password')"
        name="password"
        counter="255"
      />
    </v-col>

    <!-- Remember Token Field -->
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <ValidationText
        v-model="data.remember_token"
        rules="max:100"
        counter="100"
        :label="$t('models.user.fields.remember_token')"
        name="remember_token"
      />
    </v-col>

    <!-- Is Active Field -->
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <ValidationCheckbox
        v-model="data.is_active"
        :label="$t('models.user.fields.is_active')"
        name="is_active"
      />
    </v-col>

  </v-row>
</template>

<script lang="ts">
import { defineComponent, Ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'Fields',
  props: {
    initData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onChange: {
      type: Function,
      default: null
    }
  },
  setup (props, { emit }) {
    const data: Ref = useVModel(props, 'initData', emit) as Ref
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
