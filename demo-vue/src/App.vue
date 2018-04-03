<template>
  <div class="App">
    <header class="App-header">
      <h1><img alt="logo" aria-label="Strickland demo" class="App-logo" src="https://raw.githubusercontent.com/jeffhandley/strickland/master/logo/strickland-black.png" /></h1>
    </header>
    <nav>
      <ul>
        <li><router-link to="/vue-state">Vue State</router-link></li>
        <li><router-link to="/vuex">Vuex</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import VueState from './components/VueState'

export default {
  name: 'App',
  components: {
    'vue-state': VueState
  }
}
</script>

<style>

</style>
