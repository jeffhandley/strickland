import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import VueState from './components/VueState';
import Vuex from './components/Vuex';
import '../../demo-react/src/index.css';

Vue.config.productionTip = false;

const routes = [
  { path: '/', redirect: '/vue-state' },
  { path: '/vue-state', component: VueState },
  { path: '/vuex', component: Vuex }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.use(VueRouter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
