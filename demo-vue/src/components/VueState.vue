<template>
  <div>
    <div class="form" @input="stricklandOnInput" @focusout="stricklandOnFocusOut">
      <div class="formfield">
        <input id="firstName" name="firstName" type="text" aria-placeholder="First name"
               :class="firstNameState.validationClassName" v-model.trim="form.firstName">
        <label for="firstName"
               :data-validation-message="firstNameState.validationMessage">First name</label>
      </div>
      <div class="formfield">
        <input id="lastName" name="lastName" type="text" aria-placeholder="Last name"
               :class="lastNameState.validationClassName" v-model.trim="form.lastName">
        <label for="lastName"
               :data-validation-message="lastNameState.validationMessage">Last name</label>
      </div>
      <div class="formfield-select">
        <select id="age" name="age" type="text"
                :class="ageState.validationClassName" v-model.number="form.age">
          <option :value="null" selected>-- Please select --</option>
          <option :value="age" :key="age" v-for="age in ages">{{ age }}</option>
        </select>
        <label for="age"
               :data-validation-message="ageState.validationMessage">Age</label>
      </div>
      <div class="formfield-radio">
        <template v-for="gender in genders">
          <input id="gender-male" name="gender" type="radio"
                 :value="gender" :key="gender"
                 :class="genderState.validationClassName" v-model="form.gender">
          <label :for="'gender-' + gender" :key="gender">{{ gender }}</label>
        </template>
        <label :data-validation-message="genderState.validationMessage">Gender</label>
      </div>
      <div class="formfield">
        <input id="username" name="username" type="text" aria-placeholder="Username"
               :class="usernameState.validationClassName" v-model.trim="form.username">
        <label for="username"
               :data-validation-message="usernameState.validationMessage">Username</label>
      </div>
      <div class="formfield">
        <input id="password" name="password" type="password" aria-placeholder="Password"
               :class="passwordState.validationClassName" v-model="form.password">
        <label for="password"
               :data-validation-message="passwordState.validationMessage">Password</label>
      </div>
      <div class="formfield">
        <input id="confirmPassword" name="confirmPassword" type="password" aria-placeholder="Confirm password"
               :class="confirmPasswordState.validationClassName" v-model="form.confirmPassword">
        <label for="confirmPassword"
               :data-validation-message="confirmPasswordState.validationMessage">Confirm password</label>
      </div>
      <div class="formfield-checkbox">
        <input id="acceptsTerms" name="acceptsTerms" type="checkbox"
               :class="acceptsTermsState.validationClassName" v-model="form.acceptsTerms">
        <label for="acceptsTerms"
               :data-validation-message="acceptsTermsState.validationMessage">
          Accept <a href="#">terms and conditions</a>
        </label>
      </div>
      <div class="formactions">
        <div>
          <button @click="stricklandOnSubmit">Submit</button>
        </div>
        <div>
          {{ isValid ? 'Can Submit' : 'Cannot Submit Yet' }}
        </div>
      </div>
    </div>
    <pre id="current-state">{{ JSON.stringify({ form, validation, validationHistory }, null, 2) }}</pre>
  </div>
</template>

<script>
import formValidator from '../../../demo/src/formValidator.js';
import stricklandMixinFactory from '../mixins/vueStricklandMixinFactory.js';
import mapFormFieldValidationState from '../mappers/vueStricklandMappers.js';

let form = {
  firstName: null,
  lastName: null,
  age: null,
  gender: null,
  username: null,
  password: null,
  confirmPassword: null,
  acceptsTerms: false
};

export default {
  name: 'VueState',
  mixins: [
    stricklandMixinFactory(formValidator)
  ],
  data: () => ({
    form,
    validationDependencies: {
      password: ['confirmPassword']
    },
    // TODO: Do we want this feature?
    // Idea is if you define this then you get some debug help
    validationHistory: [],
    ages: [...Array(100).keys()],
    genders: ['Male', 'Female', 'Trans*']
  }),
  computed: {
    ...mapFormFieldValidationState(form)
  },
  methods: {
    onSubmission (event) {
      alert('submission allowed');
    },
    onSubmissionRejection (event) {
      alert('submission denied');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .formfield-checkbox, .formfield-select, .formfield-radio {
    margin: 1em 0;
  }
</style>
