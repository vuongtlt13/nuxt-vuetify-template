<template>
  <v-app class="login-background">
    <v-main>
      <v-container fluid>
        <v-card class="mx-auto rounded-lg" max-width="500px" style="margin-top: 5%">
          <v-row style="margin: auto">
            <v-col style="margin: auto; text-align: center;">
              <h1>{{ $t('auth.login_to') }} {{ appName }}</h1>
              <br><br>
              <ValidationObserver ref="obs" v-slot="{ invalid, validated }">
                <form @submit.prevent="submit">
                  <ValidationText
                    v-model="username"
                    rules="required|min:4"
                    name="username"
                    :label="$t('auth.username')"
                  />

                  <ValidationPassword
                    v-model="password"
                    rules="required|min:6"
                    name="password"
                    :label="$t('auth.password')"
                  />

                  <v-btn
                    width="80%"
                    class="mr-4 primary"
                    type="submit"
                    :disabled="invalid || !validated"
                  >
                    {{ buttonTitle }}
                  </v-btn>
                </form>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { defineComponent } from '@vue/composition-api'
import AuthService from '~/services/auth'
import { sleep } from '~/utils'
import { NOTIFICATION_DURATION } from '~/utils/constants'
import ValidationTextArea from '~/components/validation/TextArea.vue';
import ValidationPassword from '~/components/validation/Password.vue';
import ValidationText from '~/components/validation/Text.vue';

export default defineComponent({
  components: { ValidationText, ValidationPassword, ValidationTextArea },
  layout: 'empty',
  computed: {
    ...mapGetters('config', [
      'appName'
    ]),
    ...mapGetters('auth', [
      'check'
    ]),
    usernameField () {
      return 'email'
    }
  },
  mounted () {
    //@ts-ignore
    if (this.check) {
      this.$router.push({ path: '/' })
    }
  },
  data () {
    return {
      username: '',
      password: '',
      buttonTitle: this.$t('auth.login_button_text')
    }
  },

  methods: {
    async submit () {
      try {
        this.buttonTitle = this.$tc('auth.logging_button_text')
        await sleep(300)
        let credential = {
          [this.usernameField]: this.username,
          password: this.password
        };

        const resp = await AuthService.login(credential)
        this.$notify({
          type: 'success',
          title: this.$tc('notification.error_title'),
          text: this.$tc('notification.login_success'),
          duration: NOTIFICATION_DURATION
        })
        const at = resp.data.token
        await this.$store.dispatch('auth/saveToken', { token: at })
        const redirect = (this.$route.query.redirect || '/') as any
        await this.$router.push({ path: redirect! })
      } catch (err) {
      }

      this.buttonTitle = this.$tc('auth.login_button_text')
    }
  }
})
</script>

<style lang="sass" scoped>
.login-background
  background-color: $login-background-color
</style>
