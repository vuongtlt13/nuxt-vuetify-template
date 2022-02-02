<template>
  <v-row style="height: 100%; margin-top: auto;">
    <v-spacer />
    <v-col style="margin: auto; max-width: 40px">
      <v-menu
        offset-y
        bottom
        left
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-badge
            color="red"
            overlap
            :value="unreadNotificationCount"
          >
            <span slot="badge" style="font-size: 10px"> {{ unreadNotificationCount }} </span>
            <v-icon v-bind="attrs" style="font-size: large" v-on="on">
              mdi-bell
            </v-icon>
          </v-badge>
        </template>
        <v-list v-if="notifications.length > 0" three-line min-width="300px" max-width="360px" min-height="200px">
          <template v-for="(item, index) in notifications">
            <a :href="isExternalLink(item.link) ? item.link : '#'" style="text-decoration: none; text-decoration-color: black">
              <v-list-item
                :key="item.id"
                link
                :class="'text-left ' + (item.isRead ? '' : 'font-weight-black')"
                :to="isInternalLink(item.link) ? item.link : null"
                @click="markRead(item)"
              >
                <template>
                  <v-list-item-content>
                    <v-list-item-title style="color: black!important;" v-text="item.title" />
                    <v-list-item-subtitle v-text="item.detail" />
                    <v-list-item-subtitle style="margin: 3px 0 0 3px;">
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            style="font-size: small"
                            :class="item.isRead ? '' : 'blue--text text--darken-1'"
                            v-on="on"
                          >{{ diffTimeFromNow(standardDatetime(item.createdAt)) }}</span>
                        </template>
                        <span>{{ standardDatetime(item.createdAt) }}</span>
                      </v-tooltip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </a>

            <v-divider
              v-if="index < items.length - 1"
              :key="index"
            />
          </template>
        </v-list>
      </v-menu>
    </v-col>
    <v-col sm="1" md="1" lg="1" style="display: table">
      <v-menu
        offset-y
        bottom
        left
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-avatar size="32" style="cursor: pointer;margin: auto;display: table-cell" v-bind="attrs" v-on="on">
            <img
              src="@/static/default_avatar.jpg"
              alt="Avatar"
            >
          </v-avatar>
        </template>
        <v-list class="pa-0">
          <v-list-item
            key="account_name"
            style="text-align: left;"
            class="text-sm-body-2"
          >
            <v-list-item-content style="padding: 8px 0">
              <v-list-item-title v-text="userName" />
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <template v-for="(item, index) in items">
            <v-divider v-if="item.divider" />
            <v-list-item
              :key="index"
              link
              style="text-align: left;cursor: pointer;"
              class="text-sm-body-2"
            >
              <template v-if="item.icon">
                <v-list-item-icon style="margin: 0 8px 0 0;padding: 8px 0">
                  <v-icon v-text="item.icon" />
                </v-list-item-icon>
              </template>
              <v-list-item-content style="padding: 8px 0">
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import { defineComponent } from '@vue/composition-api'
import { diffTimeFromNow, standardDatetime } from '~/utils/datetime'
import { isExternalLink, isInternalLink } from '~/utils'

export default defineComponent({
  name: 'TheRightAppBar',
  computed: {
    ...mapGetters([
      'notifications',
      'unreadNotificationCount'
    ]),
    ...mapGetters('auth', [
      'userName'
    ])
  },
  data () {
    return {
      items: [
        { title: 'Profile', icon: 'mdi-account' },
        { title: 'Logout', icon: 'mdi-logout', divider: true }
      ]
    }
  },

  methods: {
    ...mapActions([
      'markRead'
    ]),
    diffTimeFromNow,
    standardDatetime,
    isExternalLink,
    isInternalLink
  },

  created () {
    setTimeout(() => {
      this.$store.dispatch('fetchNotification')
    }, 1000)

    setInterval(() => {
      this.$store.dispatch('fetchNotification')
    }, 120000)
  }
})
</script>

<style scoped>
</style>
