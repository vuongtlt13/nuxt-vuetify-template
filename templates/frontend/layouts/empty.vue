<template>
  <v-app>
    <v-main class="main-background">
      <Nuxt/>
    </v-main>
    <notifications classes="my-notification" position="top right"/>
  </v-app>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.my-notification {
  // styling
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 15px !important;
  color: #ffffff;
  line-height: 1.5;
  border-radius: 2px;

  // style for title line
  .notification-title {
    text-transform: uppercase;
  }

  // style for content
  .notification-content {
  }

  // types (green, amber, red)
  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }

  &.info {
    background: #039aff;
    border-left-color: #005bf1;
  }
}
</style>
