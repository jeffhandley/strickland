import Vue from 'vue';
import VueRouter from 'vue-router';
import VueStateComponent from '../components/VueState';
import VuexComponent from '../components/Vuex';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/vue-state' },
  { path: '/vue-state', component: VueStateComponent },
  { path: '/vuex', component: VuexComponent }
];

export default new VueRouter({
  mode: 'history',
  routes
});
