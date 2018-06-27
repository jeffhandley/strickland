import Vue from 'vue';
import store from './store';
import router from './router';
import App from './App';
import '../../demo-react/src/index.css';
import './assets/app.scss';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
