import Vue from 'vue';
import Vuex from 'vuex';
import formStateBuilder from '../vue-strickland/formStateBuilder';
import signUpForm from '../forms/signUpForm';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    [signUpForm.name]: formStateBuilder.build(signUpForm)
  },
  mutations: {
    // TODO: Modularise/plugin this
    vueStricklandSetFormFieldValue (state, payload) {
      state[payload.formName].form[payload.fieldName] = payload.value;
    },
    vueStricklandSetValidation (state, payload) {
      state[payload.formName].validation = payload.value;
    }
  }
});
